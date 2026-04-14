import express from 'express';
import{
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
} from '../controllers/resourceController.js';
const router = express.Router();

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;


