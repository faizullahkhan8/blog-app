const Joi = require("joi");
const blogModel = require("../model/blog");
const commentModel = require("../model/comment");
const blogDTO = require("../DTO/blogDTO");
const blogDetailDTO = require("../DTO/blogDetailDTO");
const imagekit = require("../config/ImageKit");
const blogController = {
    async create(req, res, next) {
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().required(),
            photo: Joi.string().required(), // base64 string
        });

        const { error } = createBlogSchema.validate(req.body);
        if (error) return next(error);

        const { title, author, photo } = req.body;

        try {
            // Upload base64 directly to ImageKit
            const uploadResponse = await imagekit.upload({
                file: photo, // base64 string
                fileName: `${Date.now()}-${author}.png`,
                folder: "/blogs", // optional folder
            });

            // Save blog with ImageKit URL
            const newBlog = new blogModel({
                title,
                author,
                photoPath: uploadResponse.url, // ✅ CDN URL
            });

            await newBlog.save();

            const blog = new blogDTO(newBlog);
            return res.status(201).json({ blog });
        } catch (err) {
            return next(err);
        }
    },
    async readAll(req, res, next) {
        try {
            const blogs = await blogModel.find({}).populate("author");

            const blogsDTO = [];

            for (let i = 0; i < blogs.length; i++) {
                const dto = new blogDTO(blogs[i]);
                blogsDTO.push(dto);
            }
            return res.status(200).json({ blogsDTO });
        } catch (error) {
            return next(error);
        }
    },

    async readById(req, res, next) {
        try {
            // validate blog id
            const getByIdSchema = Joi.object({
                id: Joi.string().required(),
            });

            const { error } = getByIdSchema.validate(req.params);

            if (error) {
                const error = {
                    message: "id is missing",
                };
                return next(error);
            }

            // verify blog
            const { id } = req.params;

            const blog = await blogModel
                .findOne({ _id: id })
                .populate("author");

            const singleBlogDTO = new blogDetailDTO(blog);

            // send response
            return res.status(200).json({ singleBlogDTO });
        } catch (error) {
            return next(error);
        }
    },

    async update(req, res, next) {
        try {
            // validate schema
            const updateBlogSchema = Joi.object({
                title: Joi.string().required(),
                author: Joi.string().required(),
                blogID: Joi.string().required(),
                photo: Joi.string().optional(), // base64 encoded image
            });

            const { error } = updateBlogSchema.validate(req.body);
            if (error) return next(error);

            const { title, author, blogID, photo } = req.body;

            const blog = await blogModel.findOne({ _id: blogID });
            if (!blog)
                return res.status(404).json({ message: "Blog not found" });

            let updatedFields = { title, author };

            // handle new photo
            if (photo) {
                // if blog had an old image on ImageKit, delete it
                if (blog.photoPath && blog.photoFileId) {
                    try {
                        await imagekit.deleteFile(blog.photoFileId);
                    } catch (err) {
                        console.warn(
                            "Failed to delete old image:",
                            err.message
                        );
                    }
                }

                // upload new photo to ImageKit
                const uploadResponse = await imagekit.upload({
                    file: photo, // base64 image string
                    fileName: `${Date.now()}-${author}.png`,
                    folder: "/blogs",
                });

                updatedFields.photoPath = uploadResponse.url; // new URL
                updatedFields.photoFileId = uploadResponse.fileId; // store fileId for deletion later
            }

            await blogModel.updateOne({ _id: blogID }, updatedFields);

            return res
                .status(200)
                .json({ message: "Blog updated successfully" });
        } catch (error) {
            return next(error);
        }
    },

    async delete(req, res, next) {
        try {
            // validate blogId
            const deleteBlogSchema = Joi.object({
                id: Joi.string().required(),
            });

            const { error } = deleteBlogSchema.validate(req.params);
            if (error) return next(error);

            const { id } = req.params;

            // find blog first
            const blog = await blogModel.findById(id);
            if (!blog) {
                return res
                    .status(404)
                    .json({ message: "Blog not found or already deleted" });
            }

            // delete blog image from ImageKit if exists
            if (blog.photoFileId) {
                try {
                    await imagekit.deleteFile(blog.photoFileId);
                } catch (err) {
                    console.warn(
                        "Failed to delete image from ImageKit:",
                        err.message
                    );
                }
            }

            // delete blog
            await blogModel.deleteOne({ _id: id });

            // delete associated comments
            await commentModel.deleteMany({ blog: id });

            return res
                .status(200)
                .json({ message: "Blog deleted successfully" });
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = blogController;
