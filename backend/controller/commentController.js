const Joi = require("joi");
const CommentModel = require("../model/comment");
const CommentDTO = require("../DTO/commentDTO");
const blog = require("../model/blog");

const commentController = {
    async createComment(req, res, next) {
        // verify data
        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().required(),
            blog: Joi.string().required(),
        });

        const { error } = createCommentSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { content, author, blog } = req.body;

        const commentToBeSave = new CommentModel({
            content,
            author,
            blog,
        });

        await commentToBeSave.save();

        return res.status(201).json({ message: "comment created" });
    },

    async getById(req, res, next) {
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

    // async getAll(req, res, next) {
    //   // const getAllSchema = new Joi.object({
    //   //   BlogID: Joi.string().required(),
    //   // });

    //   // const { error } = getAllSchema.validate(req.params);

    //   // if (error) {
    //   //   return next(error);
    //   // }

    //   let comments;
    //   const { blogID } = req.params;

    //   try {
    //     comments = await CommentModel.find({ blog: blogID });
    //   } catch (error) {
    //     return next(error);
    //   }

    //   let commentDTO = [];

    //   comments.forEach((element, index) => {
    //     commentDTO[index] = new CommentDTO(element);
    //   });

    //   return res
    //     .status(200)
    //     .json({ length: comments.length, comments: commentDTO });
    // },

    async updateComment(req, res, next) {
        const updateCommentSchema = new Joi.object({
            id: Joi.string().required(),
            blog: Joi.string(),
            author: Joi.string().required(),
        });
    },

    async deleteComment(req, res, next) {},
};

module.exports = commentController;
