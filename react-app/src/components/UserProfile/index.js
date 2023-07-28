import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import AllBusOfUser from "../AllBusOfUser";
import AllRevOfUser from "../AllRevOfUser";
import AllFavOfUser from "../AllFavOfUser";
import { authenticate } from "../../store/session";
import "./UserProfile.css";

export default function UserProfile()
{
    const user = useSelector((state) => state.session.user);
    const { user_id } = useParams();

    //reviews are the default selection
    const [show, setShow] = useState(1);

    const dispatch = useDispatch();

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
    if(user.id !== Number(user_id)) return <div>unauthorized</div>
    return (
        <div className="user_profile_wrapper">
            <div className = "user_profile_left_wrapper">
                <div className = "user_profile_image_wrapper">
                    <img className="user_profile_image" alt="default avatar" src="https://s3-media0.fl.yelpcdn.com/assets/public/default_user_avatar_120x120_v2.yji-1fea61f9163feb39bc9a115a97bd99eb.png"></img>
                </div>
                <div className = "user_profile_username">{user.username}</div>
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
                <div>Joined on July 24, 2023</div>
                <div className = "user_profile_options">
                    <div className = "user_profile_single_option" onClick={comingSoon}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        <div className="single_option_text">Edit profile</div>
                    </div>
                    <div className = "user_profile_single_option" onClick={comingSoon}>
                        <i className="fa-solid fa-image"></i>
                        <div className="single_option_text">Add photo</div>
                    </div>
                    <div className = "user_profile_single_option" onClick={comingSoon}>
                        <i className="fa-solid fa-user-group"></i>
                        <div className="single_option_text">Add friends</div>
                    </div>
                </div>
            </div>

            <div className = "user_profile_middle_wrapper">

                <div className = "bus_rev_selection_wrapper">
                    <div onClick={() => setShow(0)} className = {`user_profile_caption ${show === 0 ? "active" : "inactive"}`}>
                        My Businesses
                    </div>
                    <div onClick={() => setShow(1)} className = {`user_profile_caption ${show === 1 ? "active" : "inactive"}`}>
                        My Reviews
                    </div>
                    <div onClick={() => setShow(2)} className = {`user_profile_caption ${show === 2 ? "active" : "inactive"}`}>
                        My Favorites
                    </div>
                </div>
                {show === 0 && <AllBusOfUser /> }
                {show === 1 && <AllRevOfUser /> }
                {show === 2 && <AllFavOfUser /> }
            </div>
        </div>
    )
}
