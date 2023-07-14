import {NavLink} from "react-router-dom";
import { useSelector } from "react-redux";

export default function LandingPage()
{
    const user = useSelector((state) => state.session.user);
    return (
        <div>
            <h1>Hello World</h1>
            { user && <NavLink to={`/users/${user.id}`}>User Profile</NavLink> }
        </div>
    )
}
