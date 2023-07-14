import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { thunkLoadSingleBusiness } from "../../store/business";
import TopCard from "../TopCard";
import ReviewCard from "../ReviewCard";

import "./SingleBusiness.css";


export default function SingleBusiness()
{
    const business = useSelector(state => state.businesses.singleBus);
    const busIsEmpty = Object.keys(business).length == 0;

    const user = useSelector(state => state.session.user);

    //make sure this line never causes a typeerror
    //initial state for both is an object, so worst case undefined === undefined
    const isOwner = user.id === business.owner_id;

    const { business_id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        //if(Number(business_id) !== business.id)
        async function fetchData()
        {
            const res = await dispatch(thunkLoadSingleBusiness(business_id));
            console.log("res in useEffect");
            console.log(res);
        }
        fetchData();
    }, [dispatch, business_id])

    function linkEdit()
    {
        history.push(`/businesses/${business_id}/edit`);
    }
    function linkReview()
    {
        history.push(`/businesses/${business_id}/reviews`);
    }

    if(busIsEmpty) return <div>loading</div>
    return(
        <>
        <TopCard business={business} />

        { isOwner && <p><button onClick={linkEdit}>Edit</button></p>}

        <p><button onClick={linkReview}>Write a Review!</button></p>

        <div className ="single_bus_wrapper">
            {
                business.reviews.map(review => (
                    <ReviewCard key = {review.id} review={review} />
                ))
            }
        </div>
    </>
    )
}
