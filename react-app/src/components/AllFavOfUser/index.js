import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { thunkLoadFavBusinessesOfUser } from "../../store/business";
import BusCard from "../BusCard";

import "./AllFavOfUser.css";

//CHANGE CLASSNAMES AND ADD TO THIS CSS FILE
export default function AllFavOfUser()
{
    //initialized to an empty array before the useEffect runs, singe intialState = {}
    const businesses = useSelector(state => Object.values(state.businesses.allBus))
    const [loaded, setLoaded] = useState(false);
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const history = useHistory();
    function find_bus()
    {
        history.push("/businesses");
    }
    useEffect(() => {
        async function fetchData()
        {
            const res = await dispatch(thunkLoadFavBusinessesOfUser());
            if(!res.error) setLoaded(true);
        }
        fetchData();
    }, [dispatch])


    if(loaded && businesses.length === 0)
    {
        return <div className="start_business" onClick={find_bus}>Find a business to favorite!</div>
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
