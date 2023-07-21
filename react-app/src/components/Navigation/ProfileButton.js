import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  function profile()
  {
    setShowMenu(false);
    history.push(`/users/${user.id}`)
  }
  function allRes()
  {
    setShowMenu(false);
    history.push("/businesses")
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
            <li className= "drop_down_profile_username">{user.username}</li>
            <li className= "drop_down_profile_email">{user.email}</li>
            <li className = "drop_down_profile_all_link" onClick={allRes}>All Businesses</li>
            <li className = "drop_down_profile_link" onClick={profile}>My Profile</li>
            <li className = "drop_down_profile_logout" onClick={handleLogout}>Log Out</li>
        </ul>
    </>
  );
}

export default ProfileButton;
