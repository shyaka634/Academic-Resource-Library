import express from 'express';
import{
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
} from '../controllers/resourceController.js';
const router = express.Router();

router.get('/resources', getAllResources);
router.get('/resources/:id', getResourceById);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

export default router;


