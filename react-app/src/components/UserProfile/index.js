import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import AllBusOfUser from "../AllBusOfUser";
import AllRevOfUser from "../AllRevOfUser";
import AllFavOfUser from "../AllFavOfUser";
import { authenticate } from "../../store/session";
import "./UserProfile.css";

export default function UserProfile()
{
    const user = useSelector((state) => state.session.user);
    const { user_id } = useParams();

    const [image, setImage] = useState(undefined);
    const [show_form, setShowForm] = useState(false);

    const [show_delete, setShowDelete] = useState(false);

    const default_url = "https://bucket-rb22.s3.us-east-2.amazonaws.com/stock_user.png"
    if(user && !show_delete && user.url !== default_url) setShowDelete(true);

    const fileInput = useRef(null);

    const [errors, setErrors] = useState({});

    //reviews are the default selection
    const [show, setShow] = useState(1);

    const dispatch = useDispatch();

    let date = new Date(user?.created_at)?.toDateString()?.slice(4);
    if(date)
    {
       if(date[4] === "0")
       date = date.slice(0,4) + date.slice(5);
    }

    //if you delete a business or review from the profile page,
    //authenticate is dispatched by the delete function so the new
    //numReviews and/or numBusinesses counts can be displayed on the page
    useEffect(() => {
        //this needs to run b/c the first user info in the store is pulled
        //from the login route which doesn't have numBus and numRev which
        //are displayed on the user profile
        dispatch(authenticate());
    }, [])

    function comingSoon()
    {
        return alert("Feature Coming Soon");
    }
    async function deletePhoto()
    {
        const options = { method: "DELETE" };
        const res = await fetch("/api/users/image", options);
        if(res.ok)
        {
            await dispatch(authenticate());
            setImage(undefined);
            setShowForm(false);
            setShowDelete(false);
        }
    }
    async function onSubmit(e)
    {
        e.preventDefault();
        if(!image) return setErrors({"image": "File Required"});

        const form_data = new FormData();
        form_data.append("image", image);
        const options = {
            method: "PATCH",
            body: form_data
        }
        const res = await fetch("/api/users/image", options);
        if(res.ok)
        {
            await dispatch(authenticate());
            setImage(undefined);
            setShowForm(false);
        }else{
            const error_data = await res.json();
            if(error_data.errors) setErrors({"image": error_data.errors.image[0]});
            if(error_data.error) setErrors({"image": error_data.error});
        }

    }
    if(user.id !== Number(user_id)) return <div>unauthorized</div>
    return (
        <div className="user_profile_wrapper">
            <div className = "user_profile_left_wrapper">
                <div className = "user_profile_image_wrapper">
                    <img className="user_profile_image" alt="default avatar" src={user.url} />
                </div>
                <div className = "user_profile_username">{user.username}</div>
            {
                !show_form &&
                <>
                <div>
                {
                    user.numBusinesses === 1 ?
                    `${user.numBusinesses} business`
                    :
                    `${user.numBusinesses} businesses`
                }
                </div>
                <div>
                {
                    user.numReviews === 1 ?
                    `${user.numReviews} review`
                    :
                    `${user.numReviews} reviews`
                }
                </div>
                <div>{date}</div>
                <div className = "user_profile_options">
                    <div className = "user_profile_single_option" onClick={comingSoon}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        <div className="single_option_text">Edit profile</div>
                    </div>
                    <div className = "user_profile_single_option" onClick={() => setShowForm(true)}>
                        <i className="fa-solid fa-image"></i>
                        <div className="single_option_text">Change photo</div>
                    </div>
                    <div className = "user_profile_single_option" onClick={comingSoon}>
                        <i className="fa-solid fa-user-group"></i>
                        <div className="single_option_text">Add friends</div>
                    </div>
                </div>
                </>
            }
            {
                show_form &&
                <div className = "user_image_form_wrapper">
                    <form onSubmit={onSubmit} encType="multipart/form-data">
                        <input className="user_image_input" type="file" accept="image/*"
                            onChange={e => setImage(e.target.files[0])}
                            ref = {fileInput} style = {{display: "none"}}/>
                    {
                        image ?
                        <span className = "user_file_span">
                            <i className="fa-solid fa-check"></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                            <i className="fa-solid fa-pen-to-square" onClick = {() => fileInput.current.click()}></i>
                        </span>
                        :
                        <span className = "user_file_span">
                        {
                            show_delete ?
                            <>
                            <i className="fa-solid fa-upload" onClick = {() => fileInput.current.click()}></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                            <i className="fa-solid fa-trash" onClick = {deletePhoto}></i>
                            </>
                            :
                            <i className="fa-solid fa-upload" onClick = {() => fileInput.current.click()}></i>
                        }
                        </span>
                    }
                        <button className = "user_image_button">Submit</button>
                    </form>
                    <button className = "user_image_cancel_button"
                        onClick={ () => { setShowForm(false); setImage(undefined); setErrors({}); } }>
                        Cancel
                    </button>
                    {
                        errors.image && !image && <span className = "user_image_error">{errors.image}</span>
                    }
                </div>
            }
            </div>

            <div className = "user_profile_middle_wrapper">

                <div className = "bus_rev_selection_wrapper">
                    <div onClick={() => setShow(0)} className = {`user_profile_caption ${show === 0 ? "active" : "inactive"}`}>
                        Businesses
                    </div>
                    <div onClick={() => setShow(1)} className = {`user_profile_caption ${show === 1 ? "active" : "inactive"}`}>
                        Reviews
                    </div>
                    <div onClick={() => setShow(2)} className = {`user_profile_caption ${show === 2 ? "active" : "inactive"}`}>
                        Favorites
                    </div>
                </div>
                {show === 0 && <AllBusOfUser /> }
                {show === 1 && <AllRevOfUser /> }
                {show === 2 && <AllFavOfUser /> }
            </div>
        </div>
    )
}
