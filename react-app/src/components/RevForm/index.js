import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkReceiveReview, thunkUpdateReview, thunkLoadSingleReview } from "../../store/review";
import StarRatingInput from "../StarRatingInput";
import RevFileInput from "../RevFileInput";
import "./RevForm.css";

export default function RevForm({edit})
{
    //for create review form will always be coming from a single business page
    //singleBus will be loaded in the store, but gone from store if you refresh
    //but you still get the business_id from useParams which is all you need
    //except for <div>{business.name}</div> at the top of the page which becomes
    //undefined and you lose the name of the business on the refresh
    //form still works b/c you have business_id..

    const business = useSelector(state => state.businesses.singleBus);
    const edit_rev = useSelector(state => state.reviews.singleRev);
    const [rating, setRating] = useState(edit ? edit_rev?.rating : "");
    const [review, setReview] = useState(edit ? edit_rev?.review : "");

    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [third, setThird] = useState("");

    const first_url = edit ? (edit_rev.images?.length >= 1 ? edit_rev.images[0].url : "") : "";
    const second_url = edit ? (edit_rev.images?.length >= 2 ? edit_rev.images[1].url : "") : "";
    const third_url =  edit ? (edit_rev.images?.length === 3 ? edit_rev.images[2].url : "") : "";

    const first_file = useRef(null);
    const second_file = useRef(null);
    const third_file = useRef(null);

    const [valErrors, setValErrors] = useState({});

    //business_id exists when !edit, review id exists when edit
    const { business_id} = useParams();
    const { review_id } = useParams();

    const [render, setRender] = useState(false)

    const dispatch = useDispatch();
    const history = useHistory();

    //linkEditReview actually dispatches the same thunk and only links here if there is a good response
    //this useEffect added after the fact for the situation when an image is deleted before form submission
    //to rerender the page and also preserve changes to the star rating/text of the review from before image deletion
    useEffect(async () => {
        if(edit)
        {
            const res = await dispatch(thunkLoadSingleReview(review_id));
        }
    }, [render])

    function landingPage()
    {
        history.push("/")
    }
    async function deleteRevImage(index)
    {
        const image_id = edit_rev.images[index-1].id;
        const res = await fetch(`/api/reviews/images/${image_id}`, {method: "Delete"});
        if(res.error)
        {

        }else
        {
            setRender(prev => !prev);
        }
        return null;
    }

    function handleImage(e, index)
    {
        if(index === 1) setFirst(e.target.files[0]);
        if(index === 2) setSecond(e.target.files[0]);
        if(index === 3) setThird(e.target.files[0]);
    };

    function onRatingChange(number)
    {
        setRating(parseInt(number));
    }

    async function onSubmit(event)
    {
        event.preventDefault();

        const formData = new FormData();

        formData.append("rating", rating);
        formData.append("review", review);

        if(first) formData.append("first", first);
        if(second) formData.append("second", second);
        if(third) formData.append("third", third);

        const new_review = formData;

        const res = edit ? await dispatch(thunkUpdateReview(review_id, new_review))
                    : await dispatch(thunkReceiveReview(business_id, new_review));
        if(res.error)
        {
            const errors = {};
            for(let key in res.error)
            {
                errors[key] = res.error[key];
            }
            setValErrors(errors);
            return;
        }else {
            history.push(`/businesses/${res.business_id}`);
            return null;
        }
    }

    if(edit && Object.keys(edit_rev).length === 0) return <div>loading</div>

    return (
        <div className = "rev_form_wrapper">
            { edit ?
                <div className ="add_your_review">{edit_rev.business?.name}</div>
                :
                <div className ="add_your_review">{business.name}</div>
            }
            {   edit ?
                <div className ="add_your_review">Update Your Review</div>
                :
                <div className ="add_your_review">Create a Review</div>
            }
            <form encType="multipart/form-data" onSubmit={onSubmit}>

                <div className="form_stars">
                    <StarRatingInput form={true} onRatingChange={onRatingChange} rating={rating}/>
                </div>
                {valErrors.rating && <p className="rev_form_errors">{valErrors.rating}</p>}

                <div>
                    <textarea className="rev_text_area" type="text" name="review" placeholder="Review"
                    // <input type="text" name="review" placeholder="Review"
                        value={review} onChange={e => setReview(e.target.value)}
                    />
                </div>
                {valErrors.review && <p className="rev_form_errors">{valErrors.review}</p>}

                <div className = "add_pictures">Add up to 3 pictures!</div>

                <input className="file_input_rev" type="file" accept="image/*" name="first"
                ref={first_file} style = {{display: "none"}} onChange={e => handleImage(e, 1)}/>

                <RevFileInput url={first_url} image={first} upload = {() => first_file.current.click()}
                    deleteImage={deleteRevImage} num={1} />

                {valErrors.first && <p className="rev_form_errors">{valErrors.first}</p>}

                <input className="file_input_rev" type="file" accept="image/*" name="second"
                 ref={second_file} style = {{display: "none"}} onChange={e => handleImage(e, 2)}/>

                <RevFileInput url={second_url} image={second} upload = {() => second_file.current.click()}
                    deleteImage={deleteRevImage} num={2} />

                {valErrors.second && <p className="rev_form_errors">{valErrors.second}</p>}

                <input className="file_input" type="file" accept="image/*" name="third"
                 ref={third_file} style = {{display: "none"}} onChange={e => handleImage(e, 3)}/>

                <RevFileInput url={third_url} image={third} upload = {() => third_file.current.click()}
                    deleteImage={deleteRevImage} num={3} />

                {valErrors.third && <p className="rev_form_errors">{valErrors.third}</p>}

                {   edit ?
                    <button className="rev_form_submit_button" type="submit">Edit Review</button>
                    :
                    <button className="rev_form_submit_button" type="submit">Submit Review</button>
                }
            </form>
            <button className="rev_form_cancel_button" onClick={landingPage}>Cancel</button>

            <div className="some_space"></div>
        </div>
    )
}
