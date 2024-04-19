import style from "./style.module.css";
import { useState, useEffect } from "react";
import { BlogById, updateBlog } from "../../API/internals";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextInput from "../TextInput/TextInput";
import { MdPhotoCamera } from "react-icons/md";

const UpdateBlog = () => {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");

    const userId = useSelector((state) => state.userSlice._id);

    const params = useParams();
    const blogID = params.id;

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await BlogById(blogID);

            setTitle(response.data.singleBlogDTO.title);
            setPhoto(response.data.singleBlogDTO.photo);
        })();

        setTitle("");
        setPhoto("");
    }, []);

    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setPhoto(reader.result);
        };
    };

    const handleUpdate = async () => {
        let data;

        if (photo.includes("http")) {
            data = {
                title,
                author: userId,
                blogID,
            };
        } else {
            data = {
                title,
                author: userId,
                blogID,
                photo,
            };
        }

        let response;
        try {
            response = await updateBlog(data);
        } catch (error) {
            console.log(error);
        }
        if (response.status === 201) {
            navigate("/blogs");
        }
    };

    return (
        <div className={style.wrapper}>
            <div className={style.header}> Crea a Blog </div>
            <TextInput
                type="text"
                name="title"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "60%" }}
            />
            <div className={style.photoPrompt}>
                <p>Choose a Photo</p>
                <label htmlFor="photo">
                    <MdPhotoCamera className={style.icon} />
                </label>
            </div>

            <input
                type="file"
                name="photo"
                accept="image/jpg,image/jpeg,image/png"
                onChange={getPhoto}
                id="photo"
                hidden
            />

            <img
                src={photo}
                alt="Selected Avater"
                className="rounded border-white border my-5"
                style={{ width: "50%" }}
            />
            <button className={style.submit} onClick={handleUpdate}>
                Submit
            </button>
        </div>
    );
};

export default UpdateBlog;
