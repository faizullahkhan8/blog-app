class blogDetailDTO {
    constructor(blog) {
        this.id = blog._id;
        this.title = blog.title;
        this.photo = blog.photoPath;
        this.authorName = blog.author.name;
        this.authorUserName = blog.author.username;
        this.createdAt = blog.createdAt;
    }
}
module.exports = blogDetailDTO;
