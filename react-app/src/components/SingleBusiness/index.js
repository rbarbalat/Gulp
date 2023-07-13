import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadSingleBusiness } from "../../store/business";
import TopCard from "../TopCard";
import ReviewCard from "../ReviewCard";

import "./SingleBusiness.css";


export default function SingleBusiness()
{
    const { business_id } = useParams();
    const business = useSelector(state => state.businesses.singleBus);
    const busIsEmpty = Object.keys(business).length == 0;

    const dispatch = useDispatch();
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

    if(busIsEmpty) return <div>loading</div>
    return(
        <>
        <TopCard business={business} />
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
