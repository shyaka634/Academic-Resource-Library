import Subject from "../models/subjectsModel.js";

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const findSubject= await Subject.findOne({where:{name}})
        if(findSubject) return res.status(400).json({message:"Subject already exists"});
        const newSubject = await Subject.create({ name, description });

        res.status(201).json(newSubject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const deleted = await Subject.destroy({ where: { subject_id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Subject not found" });
        res.status(200).json({ message: "Subject deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const subject = await Subject.findByPk(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        if (name && name !== subject.name) {
            const existingSubject = await Subject.findOne({ where: { name } });
            if (existingSubject) {
                return res.status(400).json({ message: "Subject already exists" });
            }
        }

        subject.name = name ?? subject.name;
        subject.description = description ?? subject.description;
        await subject.save();

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};