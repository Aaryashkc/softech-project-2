import Popup from "../models/popup.model.js";
import cloudinary from "../lib/cloudinary.js";

// CREATE POPUP
export const createPopup = async (req, res) => {
  try {
    const { title, message, image, isActive } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "popups",
    });

    const popup = new Popup({
      title,
      message,
      image: uploadRes.secure_url,
      isActive: isActive || false,
    });

    await popup.save();
    res.status(201).json(popup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL POPUPS
export const getPopups = async (req, res) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });
    res.json(popups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONLY ACTIVE POPUPS
export const getActivePopups = async (req, res) => {
  try {
    const popups = await Popup.find({ isActive: true }).sort({
      updatedAt: -1,
    });
    res.json(popups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET POPUP BY ID
export const getPopupById = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id);
    if (!popup) return res.status(404).json({ message: "Popup not found" });
    res.json(popup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE POPUP
export const updatePopup = async (req, res) => {
  try {
    const { title, message, image, isActive } = req.body;

    const popup = await Popup.findById(req.params.id);
    if (!popup) return res.status(404).json({ message: "Popup not found" });

    // If image changed → re-upload
    if (image && image !== popup.image) {
      if (popup.image) {
        const publicId = popup.image.split("/").slice(-2).join("/").split(".")[0];
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      }

      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "popups",
      });
      popup.image = uploadRes.secure_url;
    }

    popup.title = title || popup.title;
    popup.message = message || popup.message;
    popup.isActive = isActive !== undefined ? isActive : popup.isActive;

    const updatedPopup = await popup.save();
    res.json(updatedPopup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE POPUP
export const deletePopup = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id);
    if (!popup) return res.status(404).json({ message: "Popup not found" });

    if (popup.image) {
      const publicId = popup.image.split("/").slice(-2).join("/").split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Error deleting image:", err);
      }
    }

    await popup.deleteOne();
    res.json({ message: "Popup deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
