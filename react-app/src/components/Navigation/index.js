import React from 'react';
import { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { SearchContext } from '../../context/Search';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const history = useHistory();

	const { setTargetName, setTargetTags } = useContext(SearchContext);

	const [searchName, setSearchName] = useState(true);
	const [query, setQuery ] = useState("");

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
	function search(event)
	{
		if(event.target.className.includes("fa-tag")) return;
		if(query.trim().length === 0) return setQuery("");
		if(searchName)
		{
			setTargetName(query);
			setTargetTags("");
		}else{
			setTargetTags(query)
			setTargetName("");
		}
		setQuery("")
		history.push("/search");
	}
	return (
		<div className="header">
			<div className = "header_gulp_and_logo">
				<div className="gulp" onClick={landingPage}>gulp</div>
				<div><i className="fa-brands fa-yelp"></i></div>
			</div>
			<div className = "header_input_and_glass">
				<input
					className = "search_bar"
					onChange={e => setQuery(e.target.value)}
					value={query} type="text" placeholder={searchName ? "name" : "tag(s)"}
				/>
				<div className="glassWrapper" onClick={search}>
					<i className="fa-solid fa-magnifying-glass"></i>
					<i className={`fa-solid fa-tag${searchName ? "" : " red_tag" }`} onClick={() => setSearchName(prev => !prev)}></i>
				</div>
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
				<div className ="addBus" onClick={createBus}>Add Business</div>
			}
			{
				isLoaded && sessionUser &&
				<div className ="addBus_mediaQ" onClick={createBus}>
					<span>Add</span>
					<span>Business</span>
				</div>
			}
			{
				isLoaded && sessionUser &&
				<div className ="nav_icon_wrapper">
					<i className="fa-regular fa-bell" onClick={soon}></i>
					<i className="fa-regular fa-message" onClick={soon}></i>
					<ProfileButton user={sessionUser} />
				</div>
			}
		</div>
	);
}

export default Navigation;
