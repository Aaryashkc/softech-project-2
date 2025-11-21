import mongoose from "mongoose";

const sahityaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            required: true,
        },

        category: {
            type: String,
            enum: ["sahitya", "sangit"],
            required: true,
        },

        type: {
            type: String,
            enum: ["कविता", "कथा", "गीत", "आलोचना", "टिप्पणी", "लेख"],
            default: "कविता",
        },

        content: {
            type: String,
            required: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        authorName: {
            type: String,
            default: "Admin",
        },

        coverImage: {
            type: String,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    { timestamps: true }
);

const Sahitya = mongoose.model("Sahitya", sahityaSchema);

export default Sahitya;
