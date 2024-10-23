const Joi = require("joi");
const fs = require("fs");
const blogModel = require("../model/blog");
const commentModel = require("../model/comment");
const { BACKEND_SERVER_PATH } = require("../config/index");
const blogDTO = require("../DTO/blogDTO");
const blogDetailDTO = require("../DTO/blogDetailDTO");
const userModel = require("../model/user");
const blogController = {
    async create(req, res, next) {
        // verify req.body
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().required(),
            photo: Joi.string().required(),
        });

        const { error } = createBlogSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { title, author, photo } = req.body;

        // read as buffer
        const buffer = Buffer.from(
            photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
            "base64"
        );

        // handle photo storage and naming
        const imagePath = `${Date.now()}-${author}.png`;

        // save locally
        try {
            fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
            return next(error);
        }

        // add to db
        const newBlog = new blogModel({
            title,
            author,
            photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        });

        await newBlog.save();

        // return response
        const blog = new blogDTO(newBlog);

        return res.status(201).json({ blog });
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
            // validate blog shema
            const updateBlogSchema = new Joi.object({
                title: Joi.string().required(),
                author: Joi.string().required(),
                blogID: Joi.string().required(),
                photo: Joi.string(),
            });

            const { error } = updateBlogSchema.validate(req.body);

            if (error) {
                return next(error);
            }

            const { title, author, blogID, photo } = req.body;

            const blog = await blogModel.findOne({ _id: blogID });

            if (photo) {
                var previousPhoto = blog.photoPath;
                previousPhoto = previousPhoto.split("/").at(-1);

                //delete prveious photo
                fs.unlink(`storage/${previousPhoto}`);

                // save new photo

                // read as buffer
                const buffer = Buffer.from(
                    photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
                    "base64"
                );

                // handle photo storage and naming
                const imagePath = `${Date.now()}-${author}.png`;

                // save locally
                try {
                    fs.writeFileSync(`storage/${imagePath}`, buffer);
                } catch (error) {
                    return next(error);
                }

                // add to db
                const updateBlog = await blogModel.updateOne(
                    { _id: blogID },
                    {
                        title,
                        author,
                        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
                    }
                );
                return res.status(201).json({ message: "updated succesfully" });
            } else {
                const updateBlog = await blogModel.updateOne(
                    { _id: blogID },
                    { title }
                );

                return res.status(201).json({ updateBlog });
            }
        } catch (error) {
            return next(error);
        }
    },

    async delete(req, res, next) {
        // validate blogId
        try {
            const delelteBlogSchema = new Joi.object({
                id: Joi.string().required(),
            });

            const { error } = delelteBlogSchema.validate(req.params);

            if (error) {
                return next(error);
            }

            // delete blog
            const { id } = req.params;
            const blog = await blogModel.deleteOne({ _id: id });

            if (!blog) {
                return res.status(200).json("blog already deleted");
            }

            // delete commenets
            await commentModel.deleteMany({ blog: id });

            return res.status(200).json("blog deleted succesfully");
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = blogController;
