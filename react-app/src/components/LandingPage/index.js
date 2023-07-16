import {NavLink} from "react-router-dom";
import { useSelector } from "react-redux";

export default function LandingPage()
{
    const user = useSelector((state) => state.session.user);
    return (
        <div>
            { user && <div><NavLink to={`/users/${user.id}`}>User Profile</NavLink></div> }
            <div><NavLink to="/businesses">All Businesses</NavLink></div>
            <div><NavLink to="/businesses/new">start a business</NavLink></div>
        </div>
    )
}
