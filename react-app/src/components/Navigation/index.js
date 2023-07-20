import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	console.log(sessionUser);
	const history = useHistory();

	function login()
	{
		history.push("/login")
	}
	function signup()
	{
		history.push("/signup")
	}
	function createBus()
	{
		history.push("/businesses/new")
	}
	function landingPage()
	{
		history.push("/")
	}
	function soon()
	{
		alert("feature coming soon");
	}
	return (
		<div className="header">
			<div className = "header_gulp_and_logo">
				<div className="gulp" onClick={landingPage}>gulp</div>
				<div><i className="fa-brands fa-yelp"></i></div>
			</div>
			<div className = "header_input_and_glass">
				<input type="text" placeholder="search"/>
				<div className="glassWrapper" onClick={soon}><i className="fa-solid fa-magnifying-glass"></i></div>
			</div>
			{
				isLoaded && !sessionUser &&
				<div className = "nav_logged_out_buttons">
					<button className ="nav_login_button" onClick={login}>Log In</button>
					<button className="nav_signup_button" onClick={signup}>Sign Up</button>
				</div>
			}
			{
				isLoaded && sessionUser &&
				<div className ="addBus" onClick={createBus}>Add a Business</div>
			}
			{
				isLoaded && sessionUser &&
				<div className ="nav_icon_wrapper">
					<i className="fa-regular fa-bell" onClick={soon}></i>
					<i className="fa-regular fa-message" onClick={soon}></i>
					{/* <i className="fa-solid fa-user"></i> */}
					<ProfileButton user={sessionUser} />
				</div>
			}
		</div>
	);
}

export default Navigation;
