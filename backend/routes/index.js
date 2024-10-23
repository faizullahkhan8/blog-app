const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");

// users

//register
router.post("/register", authController.register);

//login
router.post("/login", authController.login);

//logout
router.post("/logout", authMiddleware, authController.logout);

//refresh token
router.get("/refresh", authController.refresh);

//blog

// 1. create
router.post("/blog", authMiddleware, blogController.create);

// 1. read all blogs
router.get("/blog/all", authMiddleware, blogController.readAll);

// 1. read by id
router.get("/blog/:id", authMiddleware, blogController.readById);

// 1. update
router.put("/blog", authMiddleware, blogController.update);

// 1. delelte
router.delete("/blog/:id", authMiddleware, blogController.delete);

//comments

// create
router.post("/comment", authMiddleware, commentController.createComment);

// read by id
router.get(
    "/comment/:blogID",
    authMiddleware,
    commentController.getCommentsByBlog
);

// Like
router.put("/like", authMiddleware, commentController.reactABlog);

module.exports = router;
