import Resource from "../models/resoucesModel.js";
import User from "../models/userModel.js";
import Subject from "../models/subjectsModel.js";

export async function getAllResources(req, res) {
  try {
    const resources = await Resource.findAll({
      include: [
        { model: User, attributes: ["user_id", "username"] },
        { model: Subject, attributes: ["subject_id", "name", "description"] },
      ],
    });

    res.status(200).json({ resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getResourceById(req, res) {
  const { id } = req.params;

  try {
    const resource = await Resource.findByPk(id, {
      include: [
        { model: User, attributes: ["user_id", "username"] },
        { model: Subject, attributes: ["subject_id", "name", "description"] },
      ],
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ resource });
  } catch (error) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createResource(req, res) {
  const { title, description, file_url, uploaded_by, subject_id } = req.body;

  if (!title || !description || !file_url || !uploaded_by || !subject_id) {
    return res.status(400).json({
      message: "title, description, file_url, uploaded_by and subject_id are required",
    });
  }

  try {
    const newResource = await Resource.create({
      title,
      description,
      file_url,
      uploaded_by,
      subject_id,
      created_at: new Date(),
    });

    res.status(201).json({ message: "Resource created successfully", resource: newResource });
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateResource(req, res) {
  const { id } = req.params;
  const { title, description, file_url, uploaded_by, subject_id } = req.body;

  try {
    const resourceToUpdate = await Resource.findByPk(id);
    if (!resourceToUpdate) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resourceToUpdate.title = title ?? resourceToUpdate.title;
    resourceToUpdate.description = description ?? resourceToUpdate.description;
    resourceToUpdate.file_url = file_url ?? resourceToUpdate.file_url;
    resourceToUpdate.uploaded_by = uploaded_by ?? resourceToUpdate.uploaded_by;
    resourceToUpdate.subject_id = subject_id ?? resourceToUpdate.subject_id;

    await resourceToUpdate.save();

    res.status(200).json({ message: "Resource updated successfully", resource: resourceToUpdate });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteResource(req, res) {
  const { id } = req.params;

  try {
    const resourceToDelete = await Resource.findByPk(id);
    if (!resourceToDelete) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await resourceToDelete.destroy();
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
