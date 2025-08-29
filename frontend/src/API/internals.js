import axios from "axios";

const api = axios.create({
    baseURL: "https://blogbook.up.railway.app",
    // baseURL: "http://localhost:3001/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // 5 seconds timeout
});

// Cache configuration - shorter durations for dynamic content
const CACHE_DURATION = {
    BLOGS: 10 * 60 * 1000, // 10 minutes for blogs list
    BLOG_DETAIL: 10 * 60 * 1000, // 10 minutes for individual blog
    COMMENTS: 10 * 60 * 1000, // 10 minutes for comments (more dynamic)
};

// Cache storage
const cache = {
    allBlogs: { data: null, timestamp: null },
    blogDetails: new Map(), // blogId -> { data, timestamp }
    comments: new Map(), // blogId -> { data, timestamp }
};

const isCacheValid = (cacheEntry, duration) => {
    return (
        cacheEntry &&
        cacheEntry.data &&
        cacheEntry.timestamp &&
        Date.now() - cacheEntry.timestamp < duration
    );
};

// Helper to invalidate related caches
const invalidateRelatedCaches = () => {
    cache.allBlogs = { data: null, timestamp: null };
    cache.blogDetails.clear();
    cache.comments.clear();
};

const login = async (data) => {
    try {
        const response = await api.post("/login", data);
        // Clear caches on login (user-specific data might change)
        invalidateRelatedCaches();
        return response;
    } catch (error) {
        return error;
    }
};

const signUp = async (data) => {
    try {
        const response = await api.post("/register", data);
        return response;
    } catch (error) {
        return error;
    }
};

const logOut = async () => {
    try {
        const response = await api.post("/logout");
        // Clear all caches on logout
        invalidateRelatedCaches();
        return response;
    } catch (error) {
        return error;
    }
};

const getAllBlogs = async () => {
    // Check cache first
    if (isCacheValid(cache.allBlogs, CACHE_DURATION.BLOGS)) {
        console.log("Returning cached blogs");
        return cache.allBlogs.data;
    }

    try {
        console.log("Fetching fresh blogs data");
        const response = await api.get("/blog/all");

        // Update cache
        cache.allBlogs = {
            data: response,
            timestamp: Date.now(),
        };

        return response;
    } catch (error) {
        // Return stale cache if available
        if (cache.allBlogs.data) {
            console.log("API failed, returning stale cached blogs");
            return cache.allBlogs.data;
        }
        return error;
    }
};

const submitABlog = async (data) => {
    try {
        const response = await api.post("/blog", data);
        // Invalidate blogs cache since new blog was added
        cache.allBlogs = { data: null, timestamp: null };
        return response;
    } catch (error) {
        return error;
    }
};

const BlogById = async (id) => {
    // Check cache for this specific blog
    const cacheKey = id.toString();
    const cachedBlog = cache.blogDetails.get(cacheKey);

    if (isCacheValid(cachedBlog, CACHE_DURATION.BLOG_DETAIL)) {
        console.log(`Returning cached blog ${id}`);
        return cachedBlog.data;
    }

    try {
        console.log(`Fetching fresh blog ${id}`);
        const response = await api.get(`/blog/${id}`);

        // Update cache
        cache.blogDetails.set(cacheKey, {
            data: response,
            timestamp: Date.now(),
        });

        return response;
    } catch (error) {
        // Return stale cache if available
        if (cachedBlog?.data) {
            console.log(`API failed, returning stale cached blog ${id}`);
            return cachedBlog.data;
        }
        return error;
    }
};

const deleteBlog = async (id) => {
    try {
        const response = await api.delete(`/blog/${id}`);
        // Invalidate related caches
        cache.allBlogs = { data: null, timestamp: null };
        cache.blogDetails.delete(id.toString());
        cache.comments.delete(id.toString());
        return response;
    } catch (error) {
        return error;
    }
};

const updateBlog = async (data) => {
    try {
        const response = await api.put("/blog", data);
        // Invalidate related caches
        cache.allBlogs = { data: null, timestamp: null };
        if (data.id) {
            cache.blogDetails.delete(data.id.toString());
        }
        return response;
    } catch (error) {
        return error;
    }
};

const getCommentsById = async (id) => {
    // Check cache for comments
    const cacheKey = id.toString();
    const cachedComments = cache.comments.get(cacheKey);

    if (isCacheValid(cachedComments, CACHE_DURATION.COMMENTS)) {
        console.log(`Returning cached comments for blog ${id}`);
        return cachedComments.data;
    }

    try {
        console.log(`Fetching fresh comments for blog ${id}`);
        const response = await api.get(`/comment/${id}`, {
            validateStatus: false,
        });

        // Update cache
        cache.comments.set(cacheKey, {
            data: response,
            timestamp: Date.now(),
        });

        return response;
    } catch (error) {
        // Return stale cache if available
        if (cachedComments?.data) {
            console.log(
                `API failed, returning stale cached comments for blog ${id}`
            );
            return cachedComments.data;
        }
        return error;
    }
};

const postComment = async (data) => {
    try {
        const response = await api.post("/comment", data);
        // Invalidate comments cache for this blog
        if (data.blogId) {
            cache.comments.delete(data.blogId.toString());
        }
        return response;
    } catch (error) {
        return error;
    }
};

const likeABlog = async (data) => {
    try {
        const response = await api.put("/like", data);
        // Invalidate related caches since like count changed
        cache.allBlogs = { data: null, timestamp: null };
        if (data.blogId) {
            cache.blogDetails.delete(data.blogId.toString());
        }
        return response;
    } catch (error) {
        return error;
    }
};

const refresh = async () => {
    try {
        const response = await api.get("/refresh");
        // Clear all caches on refresh
        invalidateRelatedCaches();
        return response;
    } catch (error) {
        return error;
    }
};

// Cache management utilities
export const cacheUtils = {
    clearAll: invalidateRelatedCaches,
    clearBlogs: () => {
        cache.allBlogs = { data: null, timestamp: null };
    },
    clearBlog: (id) => {
        cache.blogDetails.delete(id.toString());
    },
    clearComments: (id) => {
        cache.comments.delete(id.toString());
    },
    getCacheStatus: () => ({
        allBlogs: {
            cached: !!cache.allBlogs.data,
            age: cache.allBlogs.timestamp
                ? Date.now() - cache.allBlogs.timestamp
                : null,
        },
        blogDetails: cache.blogDetails.size,
        comments: cache.comments.size,
    }),
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
