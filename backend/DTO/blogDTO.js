class blogDTO {
    constructor(blog) {
        this.id = blog._id;
        this.title = blog.title;
        this.photo = blog.photoPath;
        this.userId = blog.author._id;
        this.username = blog.author.username;
        this.createdAt = blog.createdAt;
        this.comments = blog.comments;
        this.likes = blog.likes;
    }
}

module.exports = blogDTO;
