import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadSingleBusiness, thunkReceiveBusiness } from "../../store/business"
import { thunkUpdateBusiness } from "../../store/business";
import FileInput from "../FileInput";
import MandFileInput from "../MandFileInput";
import "./BusForm.css";

export default function BusForm({edit})
{
    const business = useSelector(state => state.businesses.singleBus);

    const [initial, setInitial] = useState(true);

    const [name, setName] = useState(edit ? business.name : "");
    const [description, setDescription] = useState(edit ? business.description : "");
    const [city, setCity] = useState(edit ? business.city : "");
    const [state, setState] = useState(edit ? business.state : "");
    const [address, setAddress] = useState(edit ? business.address : "");

    const [tag_one, setTagOne] = useState(edit ? business.tag_one : "");
    const [tag_two, setTagTwo] = useState(edit ? business.tag_two : "");
    const [tag_three, setTagThree] = useState(edit ? business.tag_three : "");

    //these hold new images
    const [prev, setPrev] = useState("")
    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [third, setThird] = useState("");

    const [prev_url, setPrevUrl] = useState(edit ? business.preview_image : "");
    //urls of images already in the database
    const first_url = edit ? (business.images?.length >= 1 ? business.images[0].url : "") : "";
    const second_url = edit ? (business.images?.length >= 2 ? business.images[1].url : "") : "";
    const third_url =  edit ? (business.images?.length === 3 ? business.images[2].url : "") : "" ;

    //useRefs will provide access to the default html file input's onChange functions for use by my file input components
    const prev_file_input = useRef(null);
    const first_file_input = useRef(null);
    const second_file_input = useRef(null);
    const third_file_input = useRef(null);

    const [valErrors, setValErrors] = useState({});

    const history = useHistory();
    const dispatch = useDispatch();

    const {business_id} = useParams();
    const [render, setRender] = useState(false)

    //do not dispatch on the first render of the edit form
    //if linked from the singleBus component, the right single business is already in the store
    //otherwise linked from a BusCard via the helper linkEditBus which dispatches before history.pushing
    useEffect(() => {
        if(edit && !initial) dispatch(thunkLoadSingleBusiness(business_id));
        //dispatch only after a forced rerender triggered by deletion of an image before form submission
    }, [render])

    //if you are on the edit form and click "Add Business" on the navBar, linked to the same component
    //values of state variables are preserved so need to reset them so the form fields are blank
    useEffect(() => {
        if(!edit && !initial)
        {
            setName("");
            setDescription("");
            setCity("");
            setState("");
            setAddress("");
            setTagOne("");
            setTagTwo("");
            setTagThree("");
            setFirst("");
            setSecond("");
            setThird("");
            setPrevUrl("");
            //first_url, second_url and third_url aren't state variables
            //so they are already reset to the empty string by the ternary
        }
    }, [edit])

    useEffect(() => {
        //initial is initialized to true and this useEffect only runs once
        setInitial(false);

        //this is only true if the page was REFRESHED
        if(edit && Object.keys(business).length === 0) dispatch(thunkLoadSingleBusiness(business_id));
    }, [])

    async function deleteBusImage(index)
    {
        const image_id = business.images[index-1].id;
        const res = await fetch(`/api/businesses/images/${image_id}`, {method: "Delete"});
        if(!res.error) setRender(prev => !prev);
        //useEffect with dep array [render] will call thunkLoadSingleBus to get the updated business and rerender the page
        return null;
    }
    function landingPage()
    {
        history.push("/");
    }
    const handleImage = (e, index) => {
        if(index === 0) setPrev(e.target.files[0])
        if(index === 1) setFirst(e.target.files[0])
        if(index === 2) setSecond(e.target.files[0])
        if(index === 3) setThird(e.target.files[0])
      };

    async function onSubmit(event)
    {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("address", address);
        formData.append("tag_one", tag_one);
        formData.append("tag_two", tag_two);
        formData.append("tag_three", tag_three);

        if(prev) formData.append("prev_url", prev);
        if(first) formData.append("first", first);
        if(second) formData.append("second", second);
        if(third) formData.append("third", third);

        const new_business = formData;

        const res = edit ? await dispatch(thunkUpdateBusiness(business_id, new_business))
                    : await dispatch(thunkReceiveBusiness(new_business));
        if(res.error)
        {
            const errors = {};
            for(let key in res.error)
            {
                errors[key] = res.error[key];
            }
            setValErrors(errors);
        }else{
            history.push(`/businesses/${res.id}`);
        }
    }

    if(edit && Object.keys(business).length === 0) return <div>loading</div>
    return(

        <>

    <div className="bus_form_page_wrapper">

        <div className = "bus_form_wrapper">
            {   edit ?
                <div className ="add_your_business">Update Your Business</div>
                :
                <div className ="add_your_business">Add Your Business</div>
            }
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <p><input className="not_file_input" type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required/></p>
                {valErrors.name && <p className="bus_form_errors">{valErrors.name}</p>}

                <p><textarea className="bus_form_text_area" type="text" name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required/></p>
                {valErrors.description && <p className="bus_form_errors">{valErrors.description}</p>}

                <p><input className="not_file_input" type="text" name="tag_one" placeholder="Search Tag" value={tag_one} onChange={e => setTagOne(e.target.value)} required/></p>
                {valErrors.tag_one && <p className="bus_form_errors">{valErrors.tag_one}</p>}

                <p><input className="not_file_input" type="text" name="tag_two" placeholder="Search Tag" value={tag_two} onChange={e => setTagTwo(e.target.value)} required/></p>
                {valErrors.tag_two && <p className="bus_form_errors">{valErrors.tag_two}</p>}

                <p><input className="not_file_input" type="text" name="tag_three" placeholder="Search Tag" value={tag_three} onChange={e => setTagThree(e.target.value)} required/></p>
                {valErrors.tag_three && <p className="bus_form_errors">{valErrors.tag_three}</p>}

                <p><input className="not_file_input" type="text" name="address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required/></p>
                {valErrors.address && <p className="bus_form_errors">{valErrors.address}</p>}

                <p><input className="not_file_input" type="text" name="city" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required/></p>
                {valErrors.city && <p className="bus_form_errors">{valErrors.city}</p>}

                <p><input className="not_file_input" type="text" name="state" placeholder="State" value={state} onChange={e => setState(e.target.value)} required/></p>
                {valErrors.state && <p className="bus_form_errors">{valErrors.state}</p>}

                <p className = "mandatory_prev_image">Mandatory Preview Image</p>

                <input id="file_input_preview_edit" className="file_input" type="file" accept="image/*" name="prev_url"
                            ref = {prev_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 0)}/>

                <MandFileInput edit={edit} url={prev_url} image={prev}
                    upload={() => prev_file_input.current.click()} />

                {valErrors.prev_url && <p className="bus_form_errors">{valErrors.prev_url}</p>}

                <p className = "bus_form_optional_images">Optional Images (3)</p>

                <input id="file_input_1" className="file_input" type="file" accept="image/*" name="first"
                    ref = {first_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 1)}/>

                <FileInput url={first_url} image={first} upload = {() => first_file_input.current.click()}
                    deleteImage={deleteBusImage} num={1} />

                {valErrors.first && <p className="bus_form_errors">{valErrors.first}</p>}

                <input id="file_input_2" className="file_input" type="file" accept="image/*" name="second"
                    ref = {second_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 2)}/>

                <FileInput url={second_url} image={second} upload = {() => second_file_input.current.click()}
                    deleteImage={deleteBusImage} num={2} />

                {valErrors.second && <p className="bus_form_errors">{valErrors.second}</p>}

                <input id="file_input_3" className="file_input" type="file" accept="image/*" name="third"
                        ref = {third_file_input} style = {{display: "none"}} onChange={e => handleImage(e, 3)}/>

                <FileInput url={third_url} image={third} upload = {() => third_file_input.current.click()}
                    deleteImage={deleteBusImage} num={3} />

                {valErrors.third && <p className="bus_form_errors">{valErrors.third}</p>}
                {
                    edit ?
                    <button className="bus_form_submit_button" type="submit">Edit Business</button>
                    :
                    <button className="bus_form_submit_button" type="submit">Submit Business</button>
                }
            </form>
            <button className="bus_form_cancel_button" onClick={landingPage}>Cancel</button>
        </div>

        <div className = "bus_form_right_image_wrapper">
            <img className ="bus_form_logo_image" alt="logo" src="https://bucket-rb22.s3.us-east-2.amazonaws.com/yelp_pic.png" />
        </div>

    </div>

    </>
    )
}
