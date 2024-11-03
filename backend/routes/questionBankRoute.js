import express from 'express';
import {
  createQuestionBank,
  getAllQuestionBanks,
  getQuestionsByLanguage,
  updateQuestion,
  deleteQuestionBank
} from '../controllers/questionBankController.js';

const router = express.Router();

router.post('/create', createQuestionBank);
router.get('/getAll', getAllQuestionBanks);
router.get('/:language', getQuestionsByLanguage);
router.put('/update/:language/:questionId', updateQuestion);
router.delete('/delete/:language/:questionId', deleteQuestionBank);

export default router;
