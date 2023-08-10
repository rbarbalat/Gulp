import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {login, signUp } from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [errors, setErrors] = useState([]);
  // switch to object
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  async function loginDemo()
  {
    await dispatch(login("demo@aa.io", "password"));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //make old errors go away
    setErrors({})
    if (password === confirmPassword) {
        const data = await dispatch(signUp(username, email, password));
        if (data) {
          // setErrors(data)
          const val_errors = {}
          data.forEach(ele => {
            const index = ele.indexOf(":");
            val_errors[ele.slice(0, index - 1)] = ele.slice(index + 2);
          })
          setErrors(val_errors);
        }
    } else {
        //setErrors(['Confirm Password field must be the same as the Password field']);
        setErrors({
          confirmPassword: "The passwords don't match"
        });
    }
  };

  return (
    <div className = "signup_page_wrapper">

      <div className = "signup_left_content_wrapper">

        <div className = "signup_left_content_top_wrapper">
          <div className = "signup_to_gulp">Sign Up for Gulp</div>
          <div className = "connect_with_bus">Connect with great local businesses</div>
          <div className = "signup_terms">
            By continuing, you agree to Gulp's Terms of Servie and acknowledge
            Gulp's privacy Policy
          </div>
        </div>
        <div className = "signup_form_wrapper">
          <form onSubmit={handleSubmit}>

            <p><input className="signup_input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/></p>
            {errors.email && <p className = "signup_errors">{errors.email}</p>}
            <p><input className="signup_input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username"/></p>
            {errors.username && <p className = "signup_errors">{errors.username}</p>}
            <p><input className="signup_input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/></p>
            {errors.password && <p className = "signup_errors">{errors.password}</p>}
            <p><input className="signup_input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password"/></p>
            {errors.confirmPassword && <p className = "signup_errors">{errors.confirmPassword}</p>}

            <p><button className="signup_button" type="submit">Sign Up</button></p>
          </form>
          <p><button className="signup_button" onClick={loginDemo}>Demo User</button></p>
        </div>
      </div>

      <div className = "signup_right_image_wrapper">
        <img className ="signup_logo_image" alt="logo" src="https://bucket-rb22.s3.us-east-2.amazonaws.com/yelp_pic.png"></img>
      </div>
    </div>
  )
}

export default SignupFormPage;
