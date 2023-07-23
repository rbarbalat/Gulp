import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import AllBusOfUser from "../AllBusOfUser";
import AllRevOfUser from "../AllRevOfUser";
import { authenticate } from "../../store/session";
import "./UserProfile.css";

export default function UserProfile()
{
    const user = useSelector((state) => state.session.user);
    const { user_id } = useParams();
    const [showRev, setShowRev] = useState(false);

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
                <div>Joined on Sep 22, 2022</div>
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
                    <div onClick={() => setShowRev(false)} className = {`user_profile_caption ${showRev ? "inactive" : "active"}`}>
                        My Businesses
                    </div>
                    <div onClick={() => setShowRev(true)} className = {`user_profile_caption ${showRev ? "active" : "inactive"}`}>
                        My Reviews
                    </div>
                </div>
                { showRev ? <AllRevOfUser /> : <AllBusOfUser />}
                {/* <AllRevOfUser /> */}
                {/* <AllBusOfUser /> */}
            </div>
        </div>
    )
}
