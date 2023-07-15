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
    const data = await dispatch(login("demo@aa.io", "password"));
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
          confirmPassword: 'Confirm Password field must be the same as the Password field'
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

            <p><button className="signup_button" type="submit">Log In</button></p>
          </form>
          <p><button className="signup_button" onClick={loginDemo}>Demo User</button></p>
        </div>
      </div>

      <div className = "signup_right_image_wrapper">
        <img className ="signup_logo_image" alt="logo" src="https://s3-media0.fl.yelpcdn.com/assets/2/www/img/7922e77f338d/signup/signup_illustration.png"></img>
      </div>
    </div>
  )
}

  // return (
  //   <>
  //     <h1>Sign Up</h1>
  //     <form onSubmit={handleSubmit}>
  //       <ul>
  //         {errors.map((error, idx) => <li key={idx}>{error}</li>)}
  //       </ul>
  //       <label>
  //         Email
  //         <input
  //           type="text"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           required
  //         />
  //       </label>
  //       <label>
  //         Username
  //         <input
  //           type="text"
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //           required
  //         />
  //       </label>
  //       <label>
  //         Password
  //         <input
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           required
  //         />
  //       </label>
  //       <label>
  //         Confirm Password
  //         <input
  //           type="password"
  //           value={confirmPassword}
  //           onChange={(e) => setConfirmPassword(e.target.value)}
  //           required
  //         />
  //       </label>
  //       <button type="submit">Sign Up</button>
  //     </form>
  //   </>
  // );
// }

export default SignupFormPage;
