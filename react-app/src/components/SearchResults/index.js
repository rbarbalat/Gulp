import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchContext } from '../../context/Search';
import { thunkLoadBusinessesQuery } from "../../store/business";
import BusCard from "../BusCard";

// import "./AllBusinesses.css";

export default function SearchResults()
{
    //initialized to an empty array before the useEffect runs, singe intialState = {}
    const businesses = useSelector(state => Object.values(state.businesses.allBus))
    const user = useSelector(state => state.session.user);

    // one of the targets will be empty and one will be non-empty (initialized to zero in case of a refresh)
    const { targetName, targetTags } = useContext(SearchContext);

    // if targetTags is empty, tags is an array holding 1 element, the empty string, shouldn't matter
    const tags = targetTags.split(" ");
    let str = "?";
    if(targetName)
    {
        str = str + `name=${targetName}`;
    }else{
        tags?.forEach((tag, i) => {
            //add an ampersand to the front as if i != 0
            if(i === 0) str = str + `tag${i}=${tag.toLowerCase()}`
            else str = str + `&tag${i}=${tag.toLowerCase()}`;
        });
    }
    str = str.toLowerCase();

    const [sort, setSort] = useState("high");
    //businesses an empty array before the thunk is dispatched so can call sort on it
    //and it auto returns an empty array, won't get typerror from undef.getTime()
    //b/c no elements to run the operation on
    if(sort === "new") businesses.sort((a,b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if(sort === "old") businesses.sort((a,b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    if(sort === "high") businesses.sort((a,b) => {
        //average is null if numReviews is 0, sort those to the back
        if(!a.average && b.average) return 1;
        if(a.average && !b.average) return -1;
        //last one doesn't matter
        if(!a.average && !b.average) return 1;

        return b.average - a.average;
    });

    if(sort === "low") businesses.sort((a,b) => {
        //sort null averages to the end
        if(!a.average && b.average) return 1;
        if(a.average && !b.average) return -1;
        if(!a.average && !b.average) return 1;

        return a.average - b.average;
    });

    if(sort === "reviews") businesses.sort((a,b) => b.numReviews - a.numReviews);

    const dispatch = useDispatch();
    useEffect(() => {
        console.log("search results useEffect");
        async function fetchData()
        {
            // const res = await dispatch(thunkLoadBusinessesQuery(`?target=${target.toLowerCase()}`));
            const res = await dispatch(thunkLoadBusinessesQuery(str));
        }
        fetchData()
    }, [targetName, targetTags])

    //this is also the loading screen
    if(businesses.length === 0) return (
        <div className = "all_bus_wrapper">
            <div className = "all_bus_caption_search">
                No Results For
                <span>{targetName ? targetName : targetTags}</span>
            </div>
        </div>
    )
    return (
        <div className = "all_bus_wrapper">

            <div className = "all_bus_caption_search">
                Search Results For
                <span>{targetName ? targetName : targetTags}</span>
            </div>
        {
            businesses.length > 0 &&
            <div className = "all_bus_sort_wrapper">
                {/* <div className = {`all_bus_sort_option${sort === "new" ? " active_sort_all" : "" }`} onClick={() => setSort("new")}>new</div>
                <div className = {`all_bus_sort_option${sort === "old" ? " active_sort_all" : "" }`} onClick={() => setSort("old")}>old</div> */}
                <div className = {`all_bus_sort_option${sort === "high" ? " active_sort_all" : "" }`} onClick={() => setSort("high")}>high</div>
                <div className = {`all_bus_sort_option${sort === "low" ? " active_sort_all" : "" }`} onClick={() => setSort("low")}>low</div>
                <div className = {`all_bus_sort_option${sort === "reviews" ? " active_sort_all" : "" }`} onClick={() => setSort("reviews")}>most reviewed</div>
            </div>
        }
        {
            businesses.map(business => (
                <BusCard key={business.id} business={business} user={user} />
            ))
        }
            <div className="all_bus_bottom_border"></div>

        </div>
    )
}
