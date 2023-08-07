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
    history.push(`/users/${user.id}`);
  }
  function landing()
  {
    setShowMenu(false);
    history.push("/");
  }
  function allRes()
  {
    setShowMenu(false);
    history.push("/businesses");
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
            <li onClick={profile}>
              <i className="fa-solid fa-user"></i>&nbsp;&nbsp;Profile
            </li>
            <li onClick={landing}>
              <i class="fa-solid fa-house"></i>&nbsp;&nbsp;Home
            </li>
            <li onClick={allRes}>
                <i className="fa-solid fa-list"></i>&nbsp;&nbsp;See All
              </li>
            <li onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Log Out
            </li>
        </ul>
    </>
  );
}

export default ProfileButton;
