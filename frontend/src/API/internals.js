import axios from "axios";

const api = axios.create({
    baseURL: "https://blogbook.up.railway.app/",
    // baseURL: "http://localhost:3001/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const login = async (data) => {
    let response;

    try {
        response = await api.post("/login", data);
    } catch (error) {
        return error;
    }
    return response;
};

const signUp = async (data) => {
    let response;

    try {
        response = await api.post("/register", data);
    } catch (error) {
        return error;
    }
    return response;
};

const logOut = async () => {
    let response;

    try {
        response = await api.post("/logout");
    } catch (error) {
        return error;
    }
    return response;
};

const getAllBlogs = async () => {
    let response;

    try {
        response = api.get("/blog/all");
    } catch (error) {
        return error;
    }
    return response;
};

const submitABlog = async (data) => {
    let response;

    try {
        response = await api.post("/blog", data);
    } catch (error) {
        return error;
    }
    return response;
};

const BlogById = async (id) => {
    let response;

    try {
        response = await api.get(`/blog/${id}`);
    } catch (error) {
        return error;
    }
    return response;
};

const deleteBlog = async (id) => {
    let response;

    try {
        response = await api.delete(`/blog/${id}`);
    } catch (error) {
        return error;
    }

    return response;
};

const updateBlog = async (data) => {
    let response;

    try {
        response = await api.put("/blog", data);
    } catch (error) {
        return error;
    }

    return response;
};

const getCommentsById = async (id) => {
    let response;

    try {
        response = await api.get(`/comment/${id}`, { validateStatus: false });
    } catch (error) {
        return error;
    }

    return response;
};

const postComment = async (data) => {
    let response;

    try {
        response = await api.post("/comment", data);
    } catch (error) {
        return error;
    }
    return response;
};

const likeABlog = async (data) => {
    let response;

    try {
        response = await api.put("/like", data);
    } catch (error) {
        return error;
    }
    return response;
};

const refresh = () => {
    let response;
    try {
        response = api.get("/refresh");
    } catch (error) {
        return error;
    }

    return response;
};

export {
    login,
    signUp,
    logOut,
    getAllBlogs,
    submitABlog,
    BlogById,
    deleteBlog,
    updateBlog,
    getCommentsById,
    postComment,
    refresh,
    likeABlog,
};
