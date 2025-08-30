import style from "./style.module.css";
import { useState } from "react";
import { submitABlog } from "../../API/internals";
import { useSelector } from "react-redux";
import TextInput from "../TextInput/TextInput";
import { useNavigate } from "react-router-dom";
import { MdClose, MdUploadFile } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SubmitBlog = () => {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const author = useSelector((state) => state.userSlice._id);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    // --- React Query Mutation ---
    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => await submitABlog(data),
        onSuccess: (response) => {
            if (response?.status === 201) {
                toast.success("Blog published successfully!");
                queryClient.invalidateQueries(["blogs"]);
                navigate("/blogs");
            } else {
                toast.error(
                    response?.data?.message || "Failed to publish blog"
                );
            }
        },
        onError: (error) => {
            console.error("Error submitting blog:", error);
            toast.error(
                error?.response?.data?.message ||
                    "An error occurred. Please try again."
            );
        },
    });

    // --- File Handling ---
    const handleFile = (file) => {
        if (!file) return;
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
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const removePhoto = () => {
        setPhoto("");
        setPhotoName("");
    };

    // --- Submit Handler ---
    const submitHandler = () => {
        const data = {
            title: title.trim(),
            author,
            photo,
        };

        if (!data.title || !data.photo) {
            toast.error("Title and image are required.");
            return;
        }

        mutate(data); // React Query handles loading + errors
    };

    const isFormValid = title.trim() && photo;

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1>Create New Blog</h1>
                <p>Share your thoughts with the world</p>
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
                                    {photoName}
                                </span>
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    className={style.removeBtn}
                                >
                                    <MdClose />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={style.actions}>
                    <button
                        type="button"
                        className={style.cancelBtn}
                        onClick={() => navigate("/blogs")}
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={style.submitBtn}
                        onClick={submitHandler}
                        disabled={!isFormValid || isPending}
                    >
                        {isPending ? "Publishing..." : "Publish Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitBlog;
