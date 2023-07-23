import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { useHistory } from "react-router-dom";
import { thunkLoadBusinesses } from "../../store/business";
import BusCard from "../BusCard";

import "./AllBusinesses.css";



export default function AllBusinesses()
{
    //initialized to an empty array before the useEffect runs, singe intialState = {}
    const businesses = useSelector(state => Object.values(state.businesses.allBus))
    const user = useSelector(state => state.session.user);

    const [sort, setSort] = useState("low");

    //businesses an empty array before the thunk is dispatched so can call sort on it
    if(sort === "new") businesses.sort((a,b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if(sort === "old") businesses.sort((a,b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    if(sort === "high") businesses.sort((a,b) => {
        //average is null if numReviews is 0, sort those to the back
        if(!a && b) return 1;
        if(a && !b) return -1;
        return b.average - a.average;
    });

    if(sort === "low") businesses.sort((a,b) => {
        if(!a && b) return 1;
        if(a && !b) return -1;
        return a.average - b.average;
    });
    console.log("the sorted array is --- ");
    console.log(businesses);

    const dispatch = useDispatch();
    useEffect(() => {
        //if(Number(business_id) !== business.id)
        async function fetchData()
        {
            const res = await dispatch(thunkLoadBusinesses());
            console.log("res in allBus useEffect");
            console.log(res);
        }
        fetchData()
    }, [dispatch])

    //if you delete all businesses, would show loading, need to change
    if(businesses.length === 0) return <div>loading</div>
    return (
        <div className = "all_bus_wrapper">
            <div className = "all_bus_caption">All Businesses</div>
            {
                // change onClick later to a function on a div that checks the event target like in old project
                businesses.map(business => (
                    <BusCard key={business.id} business={business} user={user} />
                ))
            }
            <div className="all_bus_bottom_border"></div>
        </div>
    )
}
