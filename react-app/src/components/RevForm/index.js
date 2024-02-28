import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkReceiveReview, thunkUpdateReview, thunkLoadSingleReview } from "../../store/review";
import { thunkLoadSingleBusiness } from "../../store/business";
import StarRatingInput from "../StarRatingInput";
import RevFileInput from "../RevFileInput";
import "./RevForm.css";

export default function RevForm({edit})
{
    //the create review form is always linked from the single business component(singleBus already in the store)
    //singleBus can be {} but not undefined, safe to key into it
    const business_name = useSelector(state => state.businesses.singleBus.name);
    const edit_rev = useSelector(state => state.reviews.singleRev);

    const [initial, setInitial] = useState(true);

    const [rating, setRating] = useState(edit ? edit_rev?.rating : "");
    const [review, setReview] = useState(edit ? edit_rev?.review : "");

    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [third, setThird] = useState("");

    const first_url = edit ? (edit_rev.images?.length >= 1 ? edit_rev.images[0].url : "") : "";
    const second_url = edit ? (edit_rev.images?.length >= 2 ? edit_rev.images[1].url : "") : "";
    const third_url =  edit ? (edit_rev.images?.length === 3 ? edit_rev.images[2].url : "") : "";

    //use the useRefs to access to the default html file input's onChange in my custom file input components
    const first_file_input = useRef(null);
    const second_file_input = useRef(null);
    const third_file_input = useRef(null);

    const [valErrors, setValErrors] = useState({});

    const { business_id} = useParams(); // edit === false,  /businesses/:business_id/reviews
    const { review_id } = useParams();  // edit === true,   /reviews/review_id

    const [render, setRender] = useState(false)

    const dispatch = useDispatch();
    const history = useHistory();

    //the edit review form can be linked from a review card on the singleBus component or the AllRevOfUser component
    //the linkEditReview helper calls thunkLoadSingleReview before history.pushing to this url
    //don't need to dispatch on the first render of the edit form (except for page refresh, handled below)
    useEffect(() => {
        if(edit && !initial) dispatch(thunkLoadSingleReview(review_id));
        //dispatch only after a forced rerender triggered by deletion of an image before form submission
    }, [render])

    useEffect(() => {
        //initial is initialized to true and this useEffect only runs once
        setInitial(false);

        //these conditionals can only true if the page was REFRESHED
        if(edit && Object.keys(edit_rev).length === 0) dispatch(thunkLoadSingleReview(review_id));
        if(!edit && business_name === undefined) dispatch(thunkLoadSingleBusiness(business_id));
    }, [])

    function landingPage()
    {
        history.push("/")
    }
    async function deleteRevImage(index)
    {
        const image_id = edit_rev.images[index-1].id;
        const res = await fetch(`/api/reviews/images/${image_id}`, {method: "Delete"});
        if(!res.error) setRender(prev => !prev);
        //force a rerender here, changes to state variables (i.e rating or review text are preserved)
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
        }else {
            history.push(`/businesses/${res.business_id}`);
        }
    }

    if(edit && Object.keys(edit_rev).length === 0) return <div>loading</div>

    return (
        <div className = "rev_form_wrapper">
            { edit ?
                <div className ="add_your_review">{edit_rev.business?.name}</div>
                :
                <div className ="add_your_review">{business_name}</div>
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
                        value={review} onChange={e => setReview(e.target.value)}/>
                </div>
                {valErrors.review && <p className="rev_form_errors">{valErrors.review}</p>}

                <div className = "add_pictures">Add up to 3 pictures!</div>

                <input className="file_input_rev" type="file" accept="image/*" name="first"
                ref={first_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 1)}/>

                <RevFileInput url={first_url} image={first} upload = {() => first_file_input.current.click()}
                    deleteImage={deleteRevImage} num={1} />

                {valErrors.first && <p className="rev_form_errors">{valErrors.first}</p>}

                <input className="file_input_rev" type="file" accept="image/*" name="second"
                 ref={second_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 2)}/>

                <RevFileInput url={second_url} image={second} upload = {() => second_file_input.current.click()}
                    deleteImage={deleteRevImage} num={2} />

                {valErrors.second && <p className="rev_form_errors">{valErrors.second}</p>}

                <input className="file_input" type="file" accept="image/*" name="third"
                 ref={third_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 3)}/>

                <RevFileInput url={third_url} image={third} upload = {() => third_file_input.current.click()}
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
