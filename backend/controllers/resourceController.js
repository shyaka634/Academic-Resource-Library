import User from "../models/userModel.js";
import Subject from "../models/subjectsModel.js";
 
export async function getAllResources(req,res){
    try {
        const resources= await resource.findAll({
            include:[
                {
                    model:User,
                    attributes:["name","email"]
                },
                {
                    model:Subject,
                    attributes:["name"]
                }
            ]
        });
        res.status(200).json(resources);
    } catch (error) {
        console.error("error fetching resources",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getResourceById(req,res){
    const {id}= req.params;
    try {
        const resource= await resource.findByPk(id,{
            include:[
                {
                    model:User,
                    attributes:["name","email"]
                },
                {
                    model:Subject,
                    attributes:["name"]
                }
            ]
        });
        if(!resource){
            return res.status(404).json({message:"Resource not found"});
        }
        res.status(200).json(resource);
    } catch (error) {
        console.error("error fetching resource",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function createResource(req,res){
    const {title,description,file_url,uploaded_by,subject_id}= req.body;
    try {
        const newResource= await resource.create({
            title,
            description,
            file_url,
            uploaded_by,
            subject_id,
        });
        res.status(201).json(newResource);
    } catch (error) {
        console.error("error creating resource",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateResource(req,res){
    const {id}= req.params;
    const {title,description,file_url,uploaded_by,subject_id}= req.body;
    try {
        const resourceToUpdate= await resource.findByPk(id);
        if(!resourceToUpdate){
            return res.status(404).json({message:"Resource not found"});
        }
        resourceToUpdate.title= title || resourceToUpdate.title;
        resourceToUpdate.description= description || resourceToUpdate.description;
        resourceToUpdate.file_url= file_url || resourceToUpdate.file_url;
        resourceToUpdate.uploaded_by= uploaded_by || resourceToUpdate.uploaded_by;
        resourceToUpdate.subject_id= subject_id || resourceToUpdate.subject_id;
        await resourceToUpdate.save();
        res.status(200).json(resourceToUpdate);
    } catch (error) {
        console.error("error updating resource",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteResource(req,res){
    const {id}= req.params;
    try {
        const resourceToDelete= await resource.findByPk(id);
        if(!resourceToDelete){
            return res.status(404).json({message:"Resource not found"});
        }
        await resourceToDelete.destroy();
        res.status(200).json({message:"Resource deleted successfully"});
    } catch (error) {
        console.error("error deleting resource",error);
        res.status(500).json({message:"Internal server error"});
    }
}
