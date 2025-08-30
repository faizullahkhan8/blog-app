import axios from "axios";

const api = axios.create({
    baseURL: "https://blogbook.up.railway.app",
    // baseURL: "http://localhost:3001",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

export const login = (data) => api.post("/login", data);
export const signUp = (data) => api.post("/register", data);
export const logOut = () => api.post("/logout");

export const getAllBlogs = () => api.get("/blog/all").then((res) => res.data);
export const BlogById = (id) => api.get(`/blog/${id}`).then((res) => res.data);

export const submitABlog = (data) => api.post("/blog", data);
export const deleteBlog = (id) => api.delete(`/blog/${id}`);
export const updateBlog = (data) => api.put("/blog", data);

export const getCommentsById = (id) =>
    api.get(`/comment/${id}`).then((res) => res.data);
export const postComment = (data) => api.post("/comment", data);

export const likeABlog = (data) => api.put("/like", data);
export const refresh = () => api.get("/refresh");

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.data.message === "jwt expired") {
            api.get("/refresh");
        }
    }
);
