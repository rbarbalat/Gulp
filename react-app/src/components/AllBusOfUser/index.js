import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { thunkLoadBusinessesOfUser } from "../../store/business";
import BusCard from "../BusCard";

import "./AllBusOfUser.css";

export default function AllBusOfUser()
{
    //initialized to an empty array before the useEffect runs, singe intialState = {}
    const businesses = useSelector(state => Object.values(state.businesses.allBus))
    const [loaded, setLoaded] = useState(false);
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const history = useHistory();
    function start_bus()
    {
        history.push("/businesses/new");
    }
    useEffect(() => {
        async function fetchData()
        {
            const res = await dispatch(thunkLoadBusinessesOfUser());
            if(!res.error) setLoaded(true);
        }
        fetchData();
    }, [dispatch])

    //might be zero b/c it hasn't loaded or it might be zero b/c he has no businesses
    if(loaded && businesses.length === 0)
    {
        return <div className="start_business" onClick={start_bus}>Start you first business!</div>
    }
    if(!loaded) return <div>loading</div>
    return (
        <div className ="all_bus_of_user_wrapper">
            {
                businesses.map(business => (
                    <BusCard key = {business.id} business={business} user={user} />
                ))
            }
        </div>
    )
}
