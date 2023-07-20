import {useHistory} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState} from "react";
// import {thunkLoadReviews} from "../../store/review";
import { thunkLoadBusinesses } from "../../store/business";
// import ReviewCard from "../ReviewCard";
import MiniBusCard from "../MiniBusCard";

import "./LandingPage.css";

export default function LandingPage()
{
    const user = useSelector((state) => state.session.user);
    const reviews = useSelector(state => Object.values(state.reviews.allRev));
    const businesses = useSelector(state => Object.values(state.businesses.allBus));
    // console.log("review");
    // console.log(reviews);
    const dispatch = useDispatch();
    const history = useHistory();

    const [loaded, setLoaded] = useState(false);

    const first_index = businesses?.length <= 6 ? 0 : businesses?.length - 6;
    const second_index = businesses?.length <= 6 ? 3 : businesses?.length - 3;

    const [index, setIndex] = useState(0);
    console.log("index ------- ", index);

    const styles = {
        backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), url(${businesses?.[index]?.preview_image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }

    function seeAll()
    {
        history.push("/businesses")
    }

    function soon()
    {
        alert("Feature Coming Soon");
    }

    useEffect( async () => {
        // dispatch(thunkLoadReviews())
        const res = await dispatch(thunkLoadBusinesses());
        console.log("res for thunkLoadBusinesses in landing page useEffect ");
        console.log(res);
        setLoaded(true);
    },[])

    useEffect(() => {
        console.log("hello from the interval useEffect")
        const my_interval = setInterval(() => {
            setIndex(prev => prev === businesses?.length - 1 ? 0 : prev + 1 )
        }, 4000)
        return () => clearInterval(my_interval)
    }, [])

    if(!loaded) return <div>loading</div>
    return (
        <>
        <div className = "top_landing_page" style={styles}>

        </div>

        <div className="landing_middle_bottom_wrapper">

            <div className = "recent_activity_wrapper">
                <div className="recent_activity">Recent Additions &nbsp;<span onClick={seeAll} className="see_all">(see all)</span></div>
                <div className="new_businesses new_one">
                {
                    businesses.slice(first_index, second_index).map(business => (
                        <MiniBusCard key={business.id} business={business} />
                    ))
                }
                </div>
                <div className="new_businesses">
                {
                    businesses.slice(second_index).map(business => (
                        <MiniBusCard key={business.id} business={business} />
                    ))
                }
                </div>
            </div>

            <div className = "categories_wrapper">
                <div className="category_caption">Categories</div>
                <div className="categories">
                    <div onClick={soon} className="category">Steak</div>
                    <div onClick={soon} className="category">Italian</div>
                    <div onClick={soon} className="category">Asian</div>
                    <div onClick={soon} className="category">Barbecue</div>
                </div>
                <div className="categories">
                    <div onClick={soon} className="category">French</div>
                    <div onClick={soon} className="category">Pizza</div>
                    <div onClick={soon} className="category">Mexican</div>
                    <div onClick={soon} className="category">Seafood</div>
                </div>
            </div>

            <div className="bottom_wrapper">
                <div className="bottom_column">
                    <div onClick={soon} className="bottom_top_item">About</div>
                    <div onClick={soon} className="bottom_item">About Gulp</div>
                    <div onClick={soon} className="bottom_item">Careers</div>
                    <div onClick={soon} className="bottom_item">Press</div>
                    <div onClick={soon} className="bottom_item">Investor Relations</div>
                    <div onClick={soon} className="bottom_item">Trust & Safety</div>
                </div>
                <div className="bottom_column">
                    <div onClick={soon} className="bottom_top_item">Discover</div>
                    <div onClick={soon} className="bottom_item">Collections</div>
                    <div onClick={soon} className="bottom_item">Talk</div>
                    <div onClick={soon} className="bottom_item">Events</div>
                    <div onClick={soon} className="bottom_item">Support</div>
                    <div onClick={soon} className="bottom_item">Developers</div>
                </div>
                <div className="bottom_column">
                    <div onClick={soon} className="bottom_top_item">Gulp for Business</div>
                    <div onClick={soon} className="bottom_item">Advertise on Gulp</div>
                    <div onClick={soon} className="bottom_item">Table Management</div>
                    <div onClick={soon} className="bottom_item">Business Support</div>
                    <div onClick={soon} className="bottom_item">Business Success Stories</div>
                    <div onClick={soon} className="bottom_item">Blog for Business</div>
                </div>
                <div className="bottom_column">
                    <div onClick={soon} className="bottom_top_item">Languages</div>
                    <div onClick={soon} className="bottom_item">English</div>
                    <div onClick={soon} className="bottom_item">Spanish</div>
                    <div onClick={soon} className="bottom_item">Chinese</div>
                    <div onClick={soon} className="bottom_item">German</div>
                    <div onClick={soon} className="bottom_item">Japanese</div>
                </div>
            </div>
        </div>
        </>
    )
}
