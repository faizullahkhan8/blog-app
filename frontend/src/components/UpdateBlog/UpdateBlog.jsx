import style from "./style.module.css";
import { useState, useEffect } from "react";
import { BlogById, updateBlog } from "../../API/internals";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextInput from "../TextInput/TextInput";
import { MdPhotoCamera, MdUploadFile, MdEdit } from "react-icons/md";

const UpdateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const userId = useSelector((state) => state.userSlice._id);
    const params = useParams();
    const blogID = params.id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setInitialLoading(true);
                const response = await BlogById(blogID);
                const blogData = response.data.singleBlogDTO;

                setTitle(blogData.title);
                setPhoto(blogData.photo);
                setContent(blogData.content || "");

                // Set photo name if it's a URL
                if (blogData.photo && blogData.photo.includes("http")) {
                    setPhotoName("Current Image");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
                alert("Failed to load blog data. Please try again.");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchBlogData();
    }, [blogID]);

    const handleFile = (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }

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

    const changePhoto = () => {
        document.getElementById("photo").click();
    };

    const handleUpdate = async () => {
        // Validation
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        if (!photo) {
            alert("Image is required");
            return;
        }

        setLoading(true);

        let data;
        if (photo.includes("http")) {
            data = {
                title: title.trim(),
                content: content.trim(),
                author: userId,
                blogID,
            };
        } else {
            data = {
                title: title.trim(),
                content: content.trim(),
                author: userId,
                blogID,
                photo,
            };
        }

        try {
            const response = await updateBlog(data);

            if (response?.status === 201) {
                navigate("/blogs");
            } else {
                alert("Something went wrong, please try again.");
            }
        } catch (error) {
            console.error("Error updating blog:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
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
                                    {photoName || "Current Image"}
                                </span>
                                <button
                                    type="button"
                                    onClick={changePhoto}
                                    className={style.changeBtn}
                                >
                                    <MdEdit />
                                    Change
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
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={style.submitBtn}
                        onClick={handleUpdate}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateBlog;
