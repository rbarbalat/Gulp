import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteBusiness, thunkLoadSingleBusiness, thunkReceiveBusiness } from "../../store/business"
import { thunkUpdateBusiness } from "../../store/business";
import "./BusForm.css";

export default function BusForm({edit})
{
    const business = useSelector(state => state.businesses.singleBus);
    //the edit version is linked from the page for the specific business
    //so that business is guaranteed to be the singleBus in the store
    const [name, setName] = useState(edit ? business.name : "");
    const [description, setDescription] = useState(edit ? business.description : "");
    const [city, setCity] = useState(edit ? business.city : "");
    const [state, setState] = useState(edit ? business.state : "");
    const [address, setAddress] = useState(edit ? business.address : "");

    const [prev, setPrev] = useState(undefined)
    const [first, setFirst] = useState(undefined);
    const [second, setSecond] = useState(undefined);
    const [third, setThird] = useState(undefined);

    const [prev_url, setPrevUrl] = useState(edit ? business.preview_image : "");
    const first_url = edit ? (business.images?.length >= 1 ? business.images[0].url : "") : "";
    const second_url = edit ? (business.images?.length >= 2 ? business.images[1].url : "") : "";
    const third_url =  edit ? (business.images?.length === 3 ? business.images[2].url : "") : "" ;

    console.log(first_url)
    console.log(second_url)
    console.log(third_url)

    const [valErrors, setValErrors] = useState({});

    const sessionUser = useSelector((state) => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();

    const {business_id} = useParams();
    const [render, setRender] = useState(false)

    useEffect(() => {
        if(edit)
        {
            console.log("USE EFFECT")
            dispatch(thunkLoadSingleBusiness(business_id));
        }
    }, [render])
    //don't think you need anything in the dep array, took out business_id


    async function deleteBusImage(index)
    {
        const image_id = business.images[index-1].id;
        const res = await fetch(`/api/businesses/images/${image_id}`, {method: "Delete"});
        if(res.error)
        {
            console.log("bad response from thunkDeleteBusinessImage");
            console.log(res)
            alert("could not delete the image")
        }else
        {
            console.log("good response from thunkDeleteBusinessImage")
            console.log(res)
            setRender(prev => !prev);
        }
        return null;
    }
    const handleImage = (e, index) => {
        // if(!edit)
        // {
            if(index === 0) setPrev(e.target.files[0])
            if(index === 1) setFirst(e.target.files[0])
            if(index === 2) setSecond(e.target.files[0])
            if(index === 3) setThird(e.target.files[0])
        // }else{
        //     if(index === 2 && first != undefined)
        //     {
        //         setSecond(e.target.files[0])
        //     }
        // }
        //setImagePreview(URL.createObjectURL(e.target.files[0]))
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

        // if(typeof prev_url !== "string") formData.append("prev_url", prev_url);
        if(prev) formData.append("prev_url", prev);
        if(first) formData.append("first", first);
        if(second) formData.append("second", second);
        if(third) formData.append("third", third);

        const new_business = formData;

        let res;
        if(!edit)
        {
            res = await dispatch(thunkReceiveBusiness(new_business));
            console.log("print server response inside onSubmit function");
            console.log(res);
            history.push(`/businesses/${res.id}`)
        }else{
            res = await dispatch(thunkUpdateBusiness(business_id, new_business));
            console.log("print server response inside onSubmit function");
            console.log(res);
            history.push(`/businesses/${business_id}`)
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

    // if(Object.keys(business).length === 0) return <div>loading</div>
    return(

        <>

    <div className="bus_form_page_wrapper">

        <div className = "bus_form_wrapper">
            <div className ="add_your_business">Add Your Business</div>
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <p><input className="not_file_input" type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required/></p>
                {valErrors.name && <p className="bus_form_errors">{valErrors.name}</p>}

                {/* change to textarea later */}
                <p><input className="not_file_input" type="text" name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required/></p>
                {valErrors.description && <p className="bus_form_errors">{valErrors.description}</p>}

                <p><input className="not_file_input" type="text" name="address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required/></p>
                {valErrors.address && <p className="bus_form_errors">{valErrors.address}</p>}

                <p><input className="not_file_input" type="text" name="city" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required/></p>
                {valErrors.city && <p className="bus_form_errors">{valErrors.city}</p>}

                <p><input className="not_file_input" type="text" name="state" placeholder="State" value={state} onChange={e => setState(e.target.value)} required/></p>
                {valErrors.state && <p className="bus_form_errors">{valErrors.state}</p>}

                <p>Mandatory Preview Image</p>
                {
                    edit &&
                    <p>
                        <input className="file_input" type="file" accept="image/*" name="prev_url" placeholder="Preview Image Url" onChange={e => handleImage(e, 0)}/>
                        {prev_url && !prev &&
                            <p className="image_and_delete_button">
                                <img className="form_images" src={prev_url}></img>
                            </p>
                        }
                    </p>
                }
                {
                    !edit && <p><input className="file_input" type="file" accept="image/*" name="prev_url" placeholder="Preview Image Url" onChange={e => handleImage(e, 0)} required/></p>
                }
                {valErrors.prev_url && <p className="bus_form_errors">{valErrors.prev_url}</p>}

                <p>Optional Images</p>

                <p>
                    <input className="file_input" type="file" accept="image/*" name="first" placeholder="Optional Image Url" onChange={e => handleImage(e, 1)}/>
                    { first_url && !first &&
                        <p className="image_and_delete_button">
                            <img className="form_images" src={first_url}></img>
                            <div onClick={() => deleteBusImage(1)} className="bus_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </p>
                {valErrors.first && <p className="bus_form_errors">{valErrors.first}</p>}

                <p>
                    <input className="file_input" type="file" accept="image/*" name="second" placeholder="Optional Image Url" onChange={e => handleImage(e, 2)}/>
                    { second_url && !second &&
                        <p className="image_and_delete_button">
                            <img className="form_images" src={second_url}></img>
                            <div onClick={() => deleteBusImage(2)} className="bus_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </p>
                {valErrors.second && <p className="bus_form_errors">{valErrors.second}</p>}

                <p>
                    <input className="file_input" type="file" accept="image/*" name="third" placeholder="Optional Image Url" onChange={e => handleImage(e, 3)}/>
                    { third_url && !third &&
                        <p className="image_and_delete_button">
                            <img className="form_images" src={third_url}></img>
                            <div onClick={() => deleteBusImage(3)} className="bus_form_delete_image_div">Delete Image</div>
                        </p>
                    }
                </p>
                {valErrors.third && <p className="bus_form_errors">{valErrors.third}</p>}

                <button className="bus_form_submit_button" type="submit">Submit</button>
            </form>
        </div>

        <div className = "bus_form_right_image_wrapper">
            <img className ="bus_form_logo_image" alt="logo" src="https://s3-media0.fl.yelpcdn.com/assets/2/www/img/7922e77f338d/signup/signup_illustration.png"></img>
        </div>

    </div>

    </>
    )
}
