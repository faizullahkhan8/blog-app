import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    BlogById,
    getAllBlogs,
    getCommentsById,
    logOut,
    updateBlog,
} from "../API/internals";
import toast from "react-hot-toast";
import { getCryptoData, getCryptoNews } from "../API/external";
import { useDispatch } from "react-redux";
import { resetUser } from "../store/userSlice";

const useGetCryptoNews = () => {
    return useQuery({
        queryKey: ["cryptoNews"],
        queryFn: getCryptoNews,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // kept in memory even after unmount
    });
};

const useGetCryptoData = () => {
    return useQuery({
        queryKey: ["cryptoData"],
        queryFn: getCryptoData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // kept in memory even after unmount
    });
};

const useGetAllBlogs = () => {
    return useQuery({
        queryKey: ["blogs"],
        queryFn: getAllBlogs,
        staleTime: 1000 * 60 * 10, // 10 minutes
        cacheTime: 1000 * 60 * 15, // kept in memory even after unmount
    });
};

const useGetBlog = (blogId) => {
    return useQuery({
        queryKey: ["blog", blogId],
        queryFn: () => BlogById(blogId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // kept in memory even after unmount
    });
};

const useGetComments = (blogId) => {
    return useQuery({
        queryKey: ["comments", blogId],
        queryFn: () => getCommentsById(blogId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // kept in memory even after unmount
    });
};

// Mutation hooks
const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => updateBlog(data),
        onSuccess: (response, variables) => {
            toast.success("Blog updated successfully!");

            // Invalidate or update cache for blogs list
            queryClient.invalidateQueries(["blogs"]);

            // Update single blog cache if available
            queryClient.setQueryData(["blog", variables.blogID], (old) => ({
                ...old,
                title: variables.title,
                photo: variables.photo ?? old?.photo,
            }));
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to update blog."
            );
        },
    });
};

const useLogout = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: () => logOut(),
        onSuccess: () => {
            localStorage.removeItem("user");
            dispatch(resetUser());
            toast.success("Logged out successfully!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to log out.");
        },
    });
};

export {
    useGetAllBlogs,
    useGetBlog,
    useGetComments,
    useUpdateBlog,
    useGetCryptoNews,
    useGetCryptoData,
    useLogout,
};
