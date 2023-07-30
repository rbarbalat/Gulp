import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";

import Navigation from "./components/Navigation";
import AllBusinesses from "./components/AllBusinesses";
import SingleBusiness from "./components/SingleBusiness";
import BusForm from "./components/BusForm";
import RevForm from "./components/RevForm";
import UserProfile from "./components/UserProfile";
import LandingPage from "./components/LandingPage";
import SearchResults from "./components/SearchResults";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path = "/businesses">
            <AllBusinesses />
          </Route>
          <Route exact path = "/search">
            <SearchResults />
          </Route>
          <ProtectedRoute exact path = "/businesses/new">
            <BusForm edit={false} />
          </ProtectedRoute>
          <ProtectedRoute path="/businesses/:business_id/edit">
            <BusForm edit={true}/>
          </ProtectedRoute>
          <ProtectedRoute path="/businesses/:business_id/reviews">
            <RevForm edit={false}/>
          </ProtectedRoute>
          <ProtectedRoute path="/reviews/:review_id">
            <RevForm edit={true}/>
          </ProtectedRoute>
          <Route path="/businesses/:business_id">
            <SingleBusiness />
          </Route>
          {/* from landing page will click and be linked to user profile */}
          <ProtectedRoute path="/users/:user_id/">
            <UserProfile />
          </ProtectedRoute>
        </Switch>
      )}
    </>
  );
}

export default App;
