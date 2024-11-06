import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export function useWebRTC(roomId, userId) {
  const [participants, setParticipants] = useState([]);
  const [streams, setStreams] = useState({});
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const peersRef = useRef({});
  const localStreamRef = useRef();
  const screenStreamRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');
    socketRef.current.on('previous-messages', (messages) => {
      setMessages(messages);
    });
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        setStreams(prev => ({ ...prev, [userId]: stream }));
        socketRef.current.emit('join-room', roomId, userId);

        socketRef.current.on('user-connected', handleNewUser);
        socketRef.current.on('user-disconnected', handleUserDisconnected);
        socketRef.current.on('signal', handleSignal);
        socketRef.current.on('all-users', handleAllUsers);
        socketRef.current.on('chat-message', handleChatMessage);
      });

    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      Object.values(peersRef.current).forEach(peer => peer.close());
      socketRef.current.disconnect();
    };
  }, [roomId, userId]);

  function handleAllUsers(users) {
    const filteredUsers = users.filter(user => user !== userId);
    setParticipants(filteredUsers);
    filteredUsers.forEach(user => {
      if (!peersRef.current[user]) {
        const peer = createPeer(user, true);
        peersRef.current[user] = peer;
      }
    });
  }

  function handleNewUser(newUserId) {
    if (newUserId !== userId && !peersRef.current[newUserId]) {
      const peer = createPeer(newUserId, false);
      peersRef.current[newUserId] = peer;
      setParticipants(prev => [...prev, newUserId]);
    }
  }

  function handleUserDisconnected(userId) {
    if (peersRef.current[userId]) {
      peersRef.current[userId].close();
      delete peersRef.current[userId];
    }
    setParticipants(prev => prev.filter(id => id !== userId));
    setStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[userId];
      return newStreams;
    });
  }

  function createPeer(newUserId, initiator) {
    const peer = new RTCPeerConnection(configuration);
    
    const currentStream = screenStreamRef.current || localStreamRef.current;
    currentStream.getTracks().forEach(track => {
      peer.addTrack(track, currentStream);
    });

    peer.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('signal', newUserId, userId, JSON.stringify({ 'ice': event.candidate }));
      }
    };

    peer.ontrack = event => {
      setStreams(prev => ({ ...prev, [newUserId]: event.streams[0] }));
    };

    if (initiator) {
      peer.onnegotiationneeded = () => {
        peer.createOffer()
          .then(offer => peer.setLocalDescription(offer))
          .then(() => {
            socketRef.current.emit('signal', newUserId, userId, JSON.stringify({ 'sdp': peer.localDescription }));
          });
      };
    }

    return peer;
  }

  function handleSignal(fromUserId, signal) {
    const signalingData = JSON.parse(signal);
    const peer = peersRef.current[fromUserId] || createPeer(fromUserId, false);

    if (signalingData.sdp) {
      peer.setRemoteDescription(new RTCSessionDescription(signalingData.sdp))
        .then(() => {
          if (signalingData.sdp.type === 'offer') {
            peer.createAnswer()
              .then(answer => peer.setLocalDescription(answer))
              .then(() => {
                socketRef.current.emit('signal', fromUserId, userId, JSON.stringify({ 'sdp': peer.localDescription }));
              });
          }
        });
    } else if (signalingData.ice) {
      peer.addIceCandidate(new RTCIceCandidate(signalingData.ice));
    }
  }

  function toggleMic() {
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
      
      // Update the audio track for all peers
      Object.values(peersRef.current).forEach(peer => {
        const sender = peer.getSenders().find(s => s.track.kind === 'audio');
        if (sender) {
          sender.replaceTrack(audioTrack);
        }
      });
    }
  }

  function toggleCamera() {
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  }

  async function toggleScreenShare() {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        setStreams(prev => ({ ...prev, [userId]: screenStream }));
        
        Object.values(peersRef.current).forEach(peer => {
          const sender = peer.getSenders().find(s => s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });

        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      stopScreenShare();
    }
  }

  function stopScreenShare() {
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    setStreams(prev => ({ ...prev, [userId]: localStreamRef.current }));
    
    Object.values(peersRef.current).forEach(peer => {
      const sender = peer.getSenders().find(s => s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(localStreamRef.current.getVideoTracks()[0]);
      }
    });

    setIsScreenSharing(false);
  }

  function handleChatMessage(message) {
    setMessages(prev => [...prev, message]);
  }


  function endMeeting() {
    socketRef.current.emit('leave-room', roomId, userId);
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    Object.values(peersRef.current).forEach(peer => peer.close());
    socketRef.current.disconnect();
  }
  function sendMessage(message) {
    const newMessage = {
      content: message,
      sender: userId,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]); // Update local state
    socketRef.current.emit('chat-message', roomId, newMessage); // Send to server
  }
  
  function handleChatMessage(message) {
    // Check for duplicates before adding
    setMessages(prev => {
      if (prev.some(msg => msg.timestamp === message.timestamp && msg.sender === message.sender)) {
        return prev;
      }
      return [...prev, message];
    });
  }
  
  

  return { 
    participants, 
    streams, 
    toggleMic, 
    toggleCamera, 
    toggleScreenShare, 
    isMicOn, 
    isCameraOn, 
    isScreenSharing,
    messages,
    sendMessage,
    endMeeting,
    handleChatMessage
  };
}