import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkReceiveReview, thunkUpdateReview, thunkLoadSingleReview } from "../../store/review";
import "./RevForm.css";

export default function RevForm({edit})
{
    //for create review form will always be coming from a single business page
    //singleBus will be loaded in the store

    //if you have multiple reviews of the same business, if you click on a card
    //it will take you to the right one
    //make a button at the top of the single bus page that will take you to the most recent

    //rating is loaded correctly but if it isn't changed in the edit will it cause typerror
    //as in the case with default 1 in the create review case????

    const business = useSelector(state => state.businesses.singleBus);
    const edit_rev = useSelector(state => state.reviews.singleRev);
    const [rating, setRating] = useState(edit ? edit_rev?.rating : "");
    console.log("rating is ", rating);
    const [review, setReview] = useState(edit ? edit_rev?.review : "");
    console.log("printing review   ", review);
    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [third, setThird] = useState("");
    const [valErrors, setValErrors] = useState({});
    const [loaded, setLoaded] = useState(false);

    //business_id exists when !edit, review id exists when edit
    const { business_id} = useParams();
    const { review_id } = useParams();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        if(edit)
        {
            console.log("USE EFFECT");
            dispatch(thunkLoadSingleReview(review_id));
            setLoaded(true);
        }
    }, [review_id])

    async function onSubmit(event)
    {
        event.preventDefault();
        //if the user doesn't change the default rating (1)
        //it won't be accepted by the form, have to explictly make it 1
        const rev = {
            rating: rating ? Number(rating) : 1,
            review
        };
        if(first) rev.first = first;
        if(second) rev.second = second;
        if(third) rev.third = third;

        let res;
        if(!edit)
        {
            res = await dispatch(thunkReceiveReview(business_id, rev));
            console.log("print server response inside onSubmit function");
            console.log(res);
        }else{
            res = await dispatch(thunkUpdateReview(business_id, rev));
            console.log("print server response inside onSubmit function");
            console.log(res);
        }
        if(res.error)
        {
            const errors = {};
            for(let key in res.error)
            {
                errors[key] = res.error[key];
            }
            setValErrors(errors);
            return;
        }
        // history.push(`/businesses/${res.id}`);
        return null;
    }
    return (
        <div className = "rev_form_wrapper">
            <form onSubmit={onSubmit}>
                <div>
                    <select value={rating} onChange={e => setRating(e.target.value)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                    </select>
                </div>
                {valErrors.rating && <p>{valErrors.rating}</p>}

                <div>
                    <input type="text" name="review" placeholder="Review"
                        value={review} onChange={e => setReview(e.target.value)}
                    />
                </div>
                {valErrors.review && <p>{valErrors.review}</p>}

                <div>
                <input type="text" name="first" placeholder="Optional Image Url"
                        value={first} onChange={e => setFirst(e.target.value)}
                    />
                </div>
                {valErrors.first && <p>{valErrors.first}</p>}

                <div>
                    <input type="text" name="second" placeholder="Optional Image Url"
                        value={second} onChange={e => setSecond(e.target.value)}
                    />
                </div>
                {valErrors.second && <p>{valErrors.second}</p>}

                <div>
                <input type="text" name="third" placeholder="Optional Image Url"
                        value={third} onChange={e => setThird(e.target.value)}
                    />
                </div>
                {valErrors.third && <p>{valErrors.third}</p>}

                <button type="submit">Submit Review</button>

            </form>
        </div>
    )
}
