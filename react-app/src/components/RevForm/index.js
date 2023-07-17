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
    const [review, setReview] = useState(edit ? edit_rev?.review : "");

    const [first, setFirst] = useState(undefined);
    const [second, setSecond] = useState(undefined);
    const [third, setThird] = useState(undefined);

    const first_url = edit ? (edit_rev.images?.length >= 1 ? edit_rev.images[0].url : "") : "";
    const second_url = edit ? (edit_rev.images?.length >= 2 ? edit_rev.images[1].url : "") : "";
    const third_url =  edit ? (edit_rev.images?.length === 3 ? edit_rev.images[2].url : "") : "" ;

    const [valErrors, setValErrors] = useState({});
    const [loaded, setLoaded] = useState(false);

    //business_id exists when !edit, review id exists when edit
    const { business_id} = useParams();
    const { review_id } = useParams();

    const [render, setRender] = useState(false)

    const dispatch = useDispatch();
    const history = useHistory();
    //const user = useSelector((state) => state.session.user);

    useEffect(async () => {
        //consider if(edit && Object.keys(edit_revew).length == 0)
        if(edit)
        {
            console.log("USE EFFECT");
            const res = await dispatch(thunkLoadSingleReview(review_id));
            //check if setLoaded is still needed
            setLoaded(true);
        }
    }, [render])

    async function deleteRevImage(index)
    {
        const image_id = edit_rev.images[index-1].id;
        const res = await fetch(`/api/reviews/images/${image_id}`, {method: "Delete"});
        if(res.error)
        {
            console.log("bad response from delete rev image route");
            console.log(res);
            alert("could not delete the image");
        }else
        {
            console.log("good response from delete rev image route");
            console.log(res);
            setRender(prev => !prev);
        }
        return null;
    }

    const handleImage = (e, index) => {
        if(index === 1) setFirst(e.target.files[0])
        if(index === 2) setSecond(e.target.files[0])
        if(index === 3) setThird(e.target.files[0])
      };

    async function onSubmit(event)
    {
        event.preventDefault();
        //if the user doesn't change the default rating (1)
        //it won't be accepted by the form, have to explictly make it 1
        const formData = new FormData();
        formData.append("rating", rating ? Number(rating) : 1);
        formData.append("review", review);

        if(first) formData.append("first", first);
        if(second) formData.append("second", second);
        if(third) formData.append("third", third);

        const new_review = formData;

        const res = edit ? await dispatch(thunkUpdateReview(review_id, new_review))
                    : await dispatch(thunkReceiveReview(business_id, new_review));
        if(res.error)
        {
            console.log("printing error response from inside onSubmit create/edit review form");
            console.log(res);
            const errors = {};
            for(let key in res.error)
            {
                errors[key] = res.error[key];
            }
            setValErrors(errors);
            return;
        }else {
            console.log("printing good response from onSubmit in create/edit review form");
            console.log(res);
            history.push(`/businesses/${res.business_id}`);
            return null;
        }
    }
    return (
        <div className = "rev_form_wrapper">
            {   edit ?
                <div className ="add_your_review">Update Your Review</div>
                :
                <div className ="add_your_review">Create Your Review</div>
            }
            <form encType="multipart/form-data" onSubmit={onSubmit}>
                <div>
                    <div>How many stars?</div>
                    <select value={rating} onChange={e => setRating(e.target.value)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                    </select>
                </div>
                {valErrors.rating && <p className="rev_form_errors">{valErrors.rating}</p>}

                <div>
                    <textarea className="rev_text_area" type="text" name="review" placeholder="Review"
                    // <input type="text" name="review" placeholder="Review"
                        value={review} onChange={e => setReview(e.target.value)}
                    />
                </div>
                {valErrors.review && <p className="rev_form_errors">{valErrors.review}</p>}

                <div>
                    <input className="file_input_rev" type="file" accept="image/*" name="first" onChange={e => handleImage(e, 1)}/>
                    { first_url && !first &&
                        <p className="rev_image_and_delete_button">
                            <img className="rev_form_images" src={first_url}></img>
                            <div onClick={() => deleteRevImage(1)} className="rev_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </div>
                {valErrors.first && <p className="rev_form_errors">{valErrors.first}</p>}

                <div>
                    <input className="file_input_rev" type="file" accept="image/*" name="second" onChange={e => handleImage(e, 2)}/>
                    { second_url && !second &&
                        <p className="rev_image_and_delete_button">
                            <img className="rev_form_images" src={first_url}></img>
                            <div onClick={() => deleteRevImage(2)} className="rev_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </div>
                {valErrors.second && <p className="rev_form_errors">{valErrors.second}</p>}

                <div>
                    <input className="file_input" type="file" accept="image/*" name="third" onChange={e => handleImage(e, 3)}/>
                    { third_url && !third &&
                        <p className="rev_image_and_delete_button">
                            <img className="rev_form_images" src={first_url}></img>
                            <div onClick={() => deleteRevImage(3)} className="rev_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </div>
                {valErrors.third && <p className="rev_form_errors">{valErrors.third}</p>}

                {   edit ?
                    <button className="rev_form_submit_button" type="submit">Edit Review</button>
                    :
                    <button className="rev_form_submit_button" type="submit">Submit Review</button>
                }

            </form>
        </div>
    )
}
