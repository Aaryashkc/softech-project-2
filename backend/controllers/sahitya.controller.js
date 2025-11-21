import Sahitya from "../models/sahitya.model.js";
import cloudinary from "../lib/cloudinary.js";
import slugify from "slugify";

// CREATE
export const createSahitya = async (req, res) => {
    try {
        const { title, category, type, content, tags, authorName, coverImage } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ error: "Title, content, and category are required." });
        }

        const slug = slugify(title, { lower: true, strict: true });

        // Upload image IF provided
        let uploadedImage = null;
        if (coverImage) {
            const uploadRes = await cloudinary.uploader.upload(coverImage, {
                folder: "sahitya",
            });
            uploadedImage = uploadRes.secure_url;
        }

        const newEntry = await Sahitya.create({
            title,
            slug,
            category,
            type,
            content,
            tags,
            authorName,
            coverImage: uploadedImage,
            createdBy: req.user?._id || null,
        });

        res.status(201).json(newEntry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// GET ALL
export const getAllSahitya = async (req, res) => {
    try {
        const data = await Sahitya.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE (by ID)
export const getSahityaById = async (req, res) => {
    try {
        const item = await Sahitya.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
export const updateSahitya = async (req, res) => {
    try {
        const { title, category, type, content, tags, authorName, coverImage } = req.body;

        const item = await Sahitya.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });

        // If title changed → regenerate slug
        if (title && title !== item.title) {
            item.slug = slugify(title, { lower: true, strict: true });
            item.title = title;
        }

        item.category = category || item.category;
        item.type = type || item.type;
        item.content = content || item.content;
        item.tags = tags || item.tags;
        item.authorName = authorName || item.authorName;

        // If new image uploaded
        if (coverImage) {
            const uploadRes = await cloudinary.uploader.upload(coverImage, { folder: "sahitya" });
            item.coverImage = uploadRes.secure_url;
        }

        const updated = await item.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE
export const deleteSahitya = async (req, res) => {
    try {
        const deleted = await Sahitya.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });

        // Delete Cloudinary image if exists
        if (deleted.coverImage) {
            const publicId = deleted.coverImage.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        res.json({ message: "Content deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
