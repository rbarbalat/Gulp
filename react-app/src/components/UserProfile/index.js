import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import AllBusOfUser from "../AllBusOfUser";
import AllRevOfUser from "../AllRevOfUser";
import "./UserProfile.css";

export default function UserProfile()
{
    const user = useSelector((state) => state.session.user);
    const { user_id } = useParams();
    const [showRev, setShowRev] = useState(true);

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
                <div>
                    <button onClick={() => setShowRev(false)}>My Businesses</button>
                    <button onClick={() => setShowRev(true)}>My Reviews</button>
                </div>
                { !showRev && <p>Your Businesses</p> }
                { !showRev && <AllBusOfUser /> }
                { showRev && <p>Your Reviews</p>}
                { showRev && <AllRevOfUser /> }
            </div>
        </div>
    )
}
