import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errors, setErrors] = useState([]);
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      // setErrors(data);
      // the format in the starter was to return an array in this format
      // ['email : Email provided not found.', 'password : No such user exists.']
      const val_errors = {}
      data.forEach(ele => {
        const index = ele.indexOf(":");
        val_errors[ele.slice(0, index - 1)] = ele.slice(index + 2);
      })
      setErrors(val_errors);
    }
  };
  console.log(errors);
  return (
    <div className = "login_page_wrapper">

      <div className = "login_left_content_wrapper">

        <div className = "left_content_top_wrapper">
          <div className = "login_to_gulp">Log in to Gulp</div>
          <div className = "new_to_gulp">
            New to Gulp? <span><NavLink to="/signup">Sign up</NavLink></span>
          </div>
          <div className = "terms">
            By continuing, you agree to Gulp's Terms of Servie and acknowledge
            Gulp's privacy Policy
          </div>
        </div>
        <div className = "form_wrapper">
          <form onSubmit={handleSubmit}>
            <p><input className="login_input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/></p>
            {errors.email && <p className = "login_errors">{errors.email}</p>}
            <p><input className="login_input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/></p>
            {errors.password && <p className = "login_errors">{errors.password}</p>}
            <p><button className="login_button" type="submit">Log In</button></p>
          </form>
        </div>
      </div>

      <div className = "login_right_image_wrapper">
        <img className ="login_logo_image" alt="logo" src="https://s3-media0.fl.yelpcdn.com/assets/2/www/img/7922e77f338d/signup/signup_illustration.png"></img>
      </div>
    </div>
    // <>
    //   <h1>Log In</h1>
    //   <form onSubmit={handleSubmit}>
    //     <ul>
    //       {errors.map((error, idx) => (
    //         <li key={idx}>{error}</li>
    //       ))}
    //     </ul>
    //     <label>
    //       Email
    //       <input
    //         type="text"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </label>
    //     <label>
    //       Password
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </label>
    //     <button type="submit">Log In</button>
    //   </form>
    // </>
  );
}

export default LoginFormPage;
