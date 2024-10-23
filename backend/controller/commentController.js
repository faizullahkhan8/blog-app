const Joi = require("joi");
const CommentModel = require("../model/comment");
const CommentDTO = require("../DTO/commentDTO");
const blogModel = require("../model/blog");

const commentController = {
    async createComment(req, res, next) {
        try {
            // verify data
            const createCommentSchema = Joi.object({
                content: Joi.string().required(),
                author: Joi.string().required(),
                blogId: Joi.string().required(),
            });

            const { error } = createCommentSchema.validate(req.body);

            if (error) {
                return next(error);
            }

            const { content, author, blogId } = req.body;

            const existingBlog = await blogModel.findOne({ _id: blogId });

            if (!existingBlog) {
                const error = new Error("Blog not found!");
                return next(error);
            }

            const newComment = new CommentModel({
                author,
                blog: blogId,
                content,
            });

            existingBlog.comments.push(newComment._id);

            await newComment.save();
            await existingBlog.save();

            return res.status(201).json({ message: "comment created" });
        } catch (error) {
            console.log("ERROR IN CREATE COMMENT");
            return next(error);
        }
    },

    async getCommentsByBlog(req, res, next) {
        const getByIdSchema = new Joi.object({
            blogID: Joi.required(),
        });

        const { error } = getByIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const { blogID } = req.params;

        const comments = await CommentModel.find({ blog: blogID }).populate(
            "author"
        );

        let commentDTO = [];

        comments.forEach((element, index) => {
            commentDTO[index] = new CommentDTO(element);
        });

        return res
            .status(200)
            .json({ length: commentDTO.length, data: commentDTO });
    },

    async reactABlog(req, res, next) {
        const reactABlogSchema = new Joi.object({
            blogId: Joi.string().required(),
            userId: Joi.string().required(),
        });

        const { error } = reactABlogSchema.validate(req.body);

        const { blogId, userId } = req.body;

        if (error) {
            return next(error);
        }

        const existingBlog = await blogModel.findOne({ _id: blogId });

        if (!existingBlog) {
            const error = new Error("Blog not found!").status(404);
            return next(error);
        }

        const userIdIdx = existingBlog.likes.findIndex((id) => id === userId);

        if (userIdIdx > -1) {
            existingBlog.likes.splice(userIdIdx, 1);

            await existingBlog.save();

            return res.status(200).json({
                message: "Blog unliked successfully",
            });
        }

        existingBlog.likes.push(userId);

        await existingBlog.save();

        return res.status(200).json({
            message: "blog liked successfully",
        });
    },
};

module.exports = commentController;
