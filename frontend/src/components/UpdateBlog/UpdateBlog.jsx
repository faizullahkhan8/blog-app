import style from "./style.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextInput from "../TextInput/TextInput";
import { MdUploadFile, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

import { useGetBlog, useUpdateBlog } from "../../Hooks/ReactQueryHooks";

const UpdateBlog = () => {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const userId = useSelector((state) => state.userSlice._id);
    const params = useParams();
    const blogID = params.id;
    const navigate = useNavigate();

    // Fetch blog using React Query hook
    const {
        data: blogData,
        isLoading: initialLoading,
        isError,
    } = useGetBlog(blogID);

    // Mutation hook for updating the blog
    const { mutate: updateBlogMutation, isLoading: isUpdating } =
        useUpdateBlog();

    // Populate form fields when blog data is loaded
    useEffect(() => {
        if (blogData) {
            setTitle(blogData.title);
            setPhoto(blogData.photo);
            if (blogData.photo && blogData.photo.includes("http")) {
                setPhotoName("Current Image");
            }
        }
    }, [blogData]);

    // File handling
    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPhoto(reader.result);
            setPhotoName(file.name);
        };
    };

    const getPhoto = (e) => handleFile(e.target.files[0]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover")
            setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0])
            handleFile(e.dataTransfer.files[0]);
    };

    const changePhoto = () => document.getElementById("photo").click();

    const handleUpdate = () => {
        if (!title.trim()) return toast.error("Title is required");
        if (!photo) return toast.error("Image is required");

        const data = photo.includes("http")
            ? { title: title.trim(), author: userId, blogID }
            : { title: title.trim(), author: userId, blogID, photo };

        updateBlogMutation(data, {
            onSuccess: () => navigate("/blogs"),
        });
    };

    const isFormValid = title.trim() && photo;

    if (initialLoading) {
        return (
            <div className={style.container}>
                <div className={style.header}>
                    <h1>Loading...</h1>
                    <p>Fetching blog details</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={style.container}>
                <div className={style.header}>
                    <h1>Error</h1>
                    <p>Failed to load blog details. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1>Update Blog</h1>
                <p>Make changes to your blog post</p>
            </div>

            <div className={style.form}>
                <div className={style.inputGroup}>
                    <label className={style.label}>Blog Title *</label>
                    <TextInput
                        type="text"
                        name="title"
                        placeholder="Enter an engaging title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={style.titleInput}
                    />
                </div>

                <div className={style.inputGroup}>
                    <label className={style.label}>Featured Image *</label>

                    {!photo ? (
                        <div
                            className={`${style.uploadArea} ${
                                dragActive ? style.dragActive : ""
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                onChange={getPhoto}
                                hidden
                            />
                            <label
                                htmlFor="photo"
                                className={style.uploadLabel}
                            >
                                <MdUploadFile className={style.uploadIcon} />
                                <div className={style.uploadText}>
                                    <p>Click to upload or drag and drop</p>
                                    <span>PNG, JPG, JPEG, WEBP (Max 5MB)</span>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className={style.imagePreview}>
                            <img
                                src={photo}
                                alt="Preview"
                                className={style.previewImage}
                            />
                            <div className={style.imageInfo}>
                                <span className={style.imageName}>
                                    {photoName || "Current Image"}
                                </span>
                                <button
                                    type="button"
                                    onClick={changePhoto}
                                    className={style.changeBtn}
                                >
                                    <MdEdit /> Change
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        onChange={getPhoto}
                        hidden
                    />
                </div>

                <div className={style.actions}>
                    <button
                        type="button"
                        className={style.cancelBtn}
                        onClick={() => navigate("/blogs")}
                        disabled={isUpdating}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={style.submitBtn}
                        onClick={handleUpdate}
                        disabled={!isFormValid || isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateBlog;
