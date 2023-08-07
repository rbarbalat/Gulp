import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadSingleBusiness, thunkReceiveBusiness } from "../../store/business"
import { thunkUpdateBusiness } from "../../store/business";
import "./BusForm.css";

export default function BusForm({edit})
{
    const business = useSelector(state => state.businesses.singleBus);
    const [name, setName] = useState(edit ? business.name : "");
    const [description, setDescription] = useState(edit ? business.description : "");
    const [city, setCity] = useState(edit ? business.city : "");
    const [state, setState] = useState(edit ? business.state : "");
    const [address, setAddress] = useState(edit ? business.address : "");

    const [tag_one, setTagOne] = useState(edit ? business.tag_one : "");
    const [tag_two, setTagTwo] = useState(edit ? business.tag_two : "");
    const [tag_three, setTagThree] = useState(edit ? business.tag_three : "");

    const [prev, setPrev] = useState(undefined)
    const [first, setFirst] = useState(undefined);
    const [second, setSecond] = useState(undefined);
    const [third, setThird] = useState(undefined);

    const [prev_url, setPrevUrl] = useState(edit ? business.preview_image : "");

    const first_url = edit ? (business.images?.length >= 1 ? business.images[0].url : "") : "";
    const second_url = edit ? (business.images?.length >= 2 ? business.images[1].url : "") : "";
    const third_url =  edit ? (business.images?.length === 3 ? business.images[2].url : "") : "" ;

    const prev_file = useRef(null);
    const first_file = useRef(null);
    const second_file = useRef(null);
    const third_file = useRef(null);

    const [valErrors, setValErrors] = useState({});

    const history = useHistory();
    const dispatch = useDispatch();

    const {business_id} = useParams();
    const [render, setRender] = useState(false)

    useEffect(() => {
        if(edit)
        {
            // console.log("USE EFFECT")
            dispatch(thunkLoadSingleBusiness(business_id));
        }
    }, [render])

    //handle the case where you are on the edit form with pre-loaded data
    //and click the link at the top to add a new business, prevent stat var from keeping vals from edit
    useEffect(() => {
        //need to do this only when on the edit form and click add a business in the navbar
        if(!edit)
        {
            setName("");
            setDescription("");
            setCity("");
            setState("");
            setAddress("");
            setTagOne("");
            setTagTwo("");
            setTagThree("");

            setPrevUrl("");
            setFirst(undefined);
            setSecond(undefined);
            setThird(undefined);

            //the file inputs aren't set to have a value equal to a state variable
            //so they need to be reset separately
            document.querySelector("#file_input_1").value = "";
            document.querySelector("#file_input_2").value = "";
            document.querySelector("#file_input_3").value = "";
            //the mandatory one is diff between edit/add forms (b/c of required attribute) so doesn't have to be cleared
        }
    }, [edit])

    async function deleteBusImage(index)
    {
        const image_id = business.images[index-1].id;
        //no thunk b/c not store for bus+images,
        //the setRender will trigger a useEffect to call a thunk to get updated Business
        const res = await fetch(`/api/businesses/images/${image_id}`, {method: "Delete"});
        if(res.error)
        {
            // console.log("bad response from delete bus image route");
            // console.log(res);
            // alert("could not delete the image");
        }else
        {
            // console.log("good response from delete bus image route");
            // console.log(res);
            setRender(prev => !prev);
        }
        return null;
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
            // console.log("printing error response from inside onSubmit creating/edit a business");
            // console.log(res);
            const errors = {};
            for(let key in res.error)
            {
                errors[key] = res.error[key];
            }
            setValErrors(errors);
            return;
        }else{
            // console.log("printing good response from inside onSubmit creating/editing a business");
            // console.log(res);
            history.push(`/businesses/${res.id}`);
            return;
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
                {
                    edit &&
                    <p>
                        <input id="file_input_preview_edit" className="file_input" type="file" accept="image/*" name="prev_url"
                            ref = {prev_file} style = {{display: "none"}} onChange={e => handleImage(e, 0)}/>
                        {
                            prev_url && !prev &&
                            <p className="image_and_delete_button">
                                <i className="fa-solid fa-upload" onClick = {() => prev_file.current.click()}></i>
                                <img alt="preview" className="form_images" src={prev_url}></img>
                            </p>
                        }
                        {
                            prev_url && prev &&
                            <p className = "bus_form_upload_icon_wrapper">
                                <i className="fa-solid fa-check"></i>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="fa-solid fa-pen-to-square" onClick = {() => prev_file.current.click()}></i>
                            </p>
                        }
                    </p>
                }
                {
                    !edit &&
                    <p><input id="file_input_preview_add" className="file_input" type="file" accept="image/*" name="prev_url"
                        ref = {prev_file} style = {{display: "none"}} onChange={e => handleImage(e, 0)} required/></p>
                    // this one is required, the edit one is not required b/c if you don't change it, it uses the existing one
                }
                {
                    !edit && !prev &&
                    <p className = "bus_form_upload_icon_wrapper">
                        <i className="fa-solid fa-upload" onClick = {() => prev_file.current.click()}></i>
                    </p>
                }
                {
                    !edit && prev &&
                    <p className = "bus_form_upload_icon_wrapper">
                        <i className="fa-solid fa-check"></i>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        <i className="fa-solid fa-pen-to-square" onClick = {() => prev_file.current.click()}></i>
                    </p>
                }
                {valErrors.prev_url && <p className="bus_form_errors">{valErrors.prev_url}</p>}

                <p className = "bus_form_optional_images">Optional Images</p>

                <p>
                    <input id="file_input_1" className="file_input" type="file" accept="image/*" name="first"
                        ref = {first_file} style = {{display: "none"}} onChange={e => handleImage(e, 1)}/>
                    {
                        !first_url &&
                        <p className = "bus_form_upload_icon_wrapper">
                            <i className={first ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {() => first_file.current.click()}></i>
                        </p>
                    }
                    {
                        // first_url && !first &&
                        first_url &&
                        <p className="image_and_delete_button">
                            <i className={first ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {() => first_file.current.click()}></i>
                            <i className={first ? "fa-solid fa-trash hidden" : "fa-solid fa-trash"} onClick={() => deleteBusImage(1)}></i>
                            <img alt="optional one" className={ first ? "form_images hidden" : "form_images"} src={first_url}></img>
                            {/* <div onClick={() => deleteBusImage(1)} className="bus_form_delete_image_div">Delete Image</div> */}
                        </p>
                    }
                </p>
                {valErrors.first && <p className="bus_form_errors">{valErrors.first}</p>}

                <p>
                    <input id="file_input_2" className="file_input" type="file" accept="image/*" name="second" onChange={e => handleImage(e, 2)}/>
                    {
                        second_url && !second &&
                        <p className="image_and_delete_button">
                            <img alt="optional two" className="form_images" src={second_url}></img>
                            <div onClick={() => deleteBusImage(2)} className="bus_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </p>
                {valErrors.second && <p className="bus_form_errors">{valErrors.second}</p>}

                <p>
                    <input id="file_input_3" className="file_input" type="file" accept="image/*" name="third" onChange={e => handleImage(e, 3)}/>
                    {
                        third_url && !third &&
                        <p className="image_and_delete_button">
                            <img alt="optional three" className="form_images" src={third_url}></img>
                            <div onClick={() => deleteBusImage(3)} className="bus_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </p>
                {valErrors.third && <p className="bus_form_errors">{valErrors.third}</p>}
                {   edit ?
                    <button className="bus_form_submit_button" type="submit">Edit Business</button>
                    :
                    <button className="bus_form_submit_button" type="submit">Submit Business</button>
                }
            </form>
        </div>

        <div className = "bus_form_right_image_wrapper">
            <img className ="bus_form_logo_image" alt="logo" src="https://bucket-rb22.s3.us-east-2.amazonaws.com/yelp_pic.png"></img>
        </div>

    </div>

    </>
    )
}
