import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkLoadReviewsOfUser } from "../../store/review";
import ReviewCard from "../ReviewCard";

import "./AllRevOfUser.css";

export default function AllRevOfUser()
{
    //initialized to an empty array before the useEffect runs, singe intialState = {}
    const reviews = useSelector(state => Object.values(state.reviews.allRev))
    const [loaded, setLoaded] = useState(false);

    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const history = useHistory();

    function list_bus()
    {
        history.push("/businesses");
    }
    useEffect(() => {
        async function fetchData()
        {
            const res = await dispatch(thunkLoadReviewsOfUser());
            if(!res.error) setLoaded(true);
        }
        fetchData();
    }, [dispatch])

    //might be zero b/c it hasn't loaded or it might be zero b/c he has no businesses
    if(loaded && reviews.length === 0)
    {
        return <div className="start_rev" onClick={list_bus}>Find a business to review!</div>
    }
    if(!loaded) return <div>loading</div>
    return (
        <div className ="all_rev_of_user_wrapper">
        {
            reviews.map(review => (
                <ReviewCard key = {review.id} review={review} user={user} user_profile={true} />
            ))
        }
        </div>
    )
}
