import style from "./style.module.css";
import { useState } from "react";
import { submitABlog } from "../../API/internals";
import { useSelector } from "react-redux";
import TextInput from "../TextInput/TextInput";
import { useNavigate } from "react-router-dom";
import { MdPhotoCamera, MdClose, MdUploadFile } from "react-icons/md";

const SubmitBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const author = useSelector((state) => state.userSlice._id);
    const navigate = useNavigate();

    const handleFile = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPhoto(reader.result);
            setPhotoName(file.name);
        };
    };

    const getPhoto = (e) => {
        handleFile(e.target.files[0]);
    };

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

    const submitHandler = async () => {
        const data = {
            title: title.trim(),
            content: content.trim(),
            author,
            photo,
        };

        if (!data.title || !data.photo) return;

        try {
            setLoading(true);
            const response = await submitABlog(data);

            if (response?.status === 201) {
                navigate("/blogs");
            } else if (response?.code === "ERR_BAD_REQUEST") {
                alert("Something went wrong, please try again.");
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error("Error submitting blog:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
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
                    <label className={style.label}>Content (Optional)</label>
                    <textarea
                        className={style.contentInput}
                        placeholder="Write your blog content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
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
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={style.submitBtn}
                        onClick={submitHandler}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitBlog;
