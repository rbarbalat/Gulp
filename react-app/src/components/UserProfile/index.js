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
    if(user.id !== Number(user_id)) return <div>unauthorized</div>
    return (
        <div className="user_profile_wrapper">
            <div className = "user_profile_left_wrapper">
                <div className = "user_profile_image_wrapper"><img></img></div>
                <div>{user.username}</div>
                <div>city, state</div>
                <div>num Reviews</div>
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

            <div className = "user_profile_right_wrapper">
                <div>About</div>
                <div>Location</div>
                <div>city, state</div>
                <div>Gulping Since</div>
                <div>Things I love</div>
            </div>
        </div>
    )
}
