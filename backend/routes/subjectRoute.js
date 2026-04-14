import express from 'express';
import { 
    getAllSubjects, 
    createSubject, 
    getSubjectById, 
    updateSubject, 
    deleteSubject 
} from '../controllers/subjectController.js';

const router = express.Router();

// Route: /api/subjects
router.get('/', getAllSubjects);
router.post('/', createSubject);

// Route: /api/subjects/:id
router.get('/:id', getSubjectById);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;