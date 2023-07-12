import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkLoadBusinesses } from "../../store/business";
import BusCard from "../BusCard";

import "./AllBusinesses.css";



export default function AllBusinesses()
{
    //initialized to an empty array before the useEffect runs, singe intialState = {}
    const businesses = useSelector(state => Object.values(state.businesses.allBus))

    // const history = useHistory();
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

    if(businesses.length == 0) return <div>loading</div>
    return (
        <div className ="all_bus_wrapper">
            {
                businesses.map(business => (
                    <BusCard key = {business.id} business={business} />
                ))
            }
        </div>
    )
}
