const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogShema = new Schema(
    {
        title: { type: String, requried: true },
        author: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        photoPath: { type: String, required: true },
        comments: {
            type: Array,
        },
        likes: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Blog", blogShema, "blogs");
