import style from "./style.module.css";
import { useState } from "react";
import { submitABlog } from "../../API/internals";
import { useSelector } from "react-redux";
import TextInput from "../TextInput/TextInput";
import { useNavigate } from "react-router-dom";
import { MdPhotoCamera } from "react-icons/md";

const SubmitBlog = () => {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");

    const author = useSelector((state) => state.userSlice._id);

    const navigate = useNavigate();

    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => setPhoto(reader.result);
    };

    const submitHandler = async () => {
        const data = {
            title,
            author,
            photo,
        };

        const response = await submitABlog(data);

        if (response.status === 201) {
            navigate("/blogs");
        } else if (response.code === "ERR_BAD_REQUST") {
            alert("somethings went wrong please try again");
        }
    };

    return (
        <div className={style.wrapper}>
            <div className={style.header}> Create a Blog </div>
            <TextInput
                type="text"
                name="title"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "60%" }}
            />
            <div className={style.photoPrompt}>
                <label htmlFor="photo">
                    <p>Choose a Photo</p>
                </label>
                <label htmlFor="photo">
                    <MdPhotoCamera className={style.icon} />
                </label>
                <input
                    type="file"
                    name="photo"
                    accept="image/jpg,image/jpeg,image/png"
                    onChange={getPhoto}
                    id="photo"
                    hidden
                />
            </div>

            <img
                src={photo}
                alt="Selected Avater"
                className="rounded border-white border my-5"
                style={{ width: "100px" }}
            />
            <button
                className={style.submit}
                onClick={submitHandler}
                disabled={title === "" || photo === ""}
            >
                Submit
            </button>
        </div>
    );
};

export default SubmitBlog;
