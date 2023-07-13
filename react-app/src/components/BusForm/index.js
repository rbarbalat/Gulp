import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkReceiveBusiness } from "../../store/business"
import { thunkUpdateBusiness } from "../../store/business";
import "./BusForm.css";

export default function BusForm({edit})
{
    const business = useSelector(state => state.businesses.singleBus)
    const [name, setName] = useState(business?.name ? business.name : "");
    const [description, setDescription] = useState(business?.description ? business.description : "");
    const [city, setCity] = useState(business?.city ? business.city : "");
    const [state, setState] = useState(business?.state ? business.state : "");
    const [address, setAddress] = useState(business?.address ? business.address : "");
    const [prev_url, setPrevUrl] = useState(business?.prev_url ? business.prev_url : "");
    const [first, setFirst] = useState();
    const [second, setSecond] = useState("");
    const [third, setThird] = useState("");
    const [valErrors, setValErrors] = useState({});

    const sessionUser = useSelector((state) => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();
    const {business_id} = useParams();

    // console.log("line 26");
    // console.log(name === "");

    useEffect(() => {

    }, [])

    async function onSubmit(event)
    {
        event.preventDefault();
        const business = {name, description, city, state, address, prev_url }
        if(first) business.first = first;
        if(second) business.second = second;
        if(third) business.third = third;

        const res = await dispatch(thunkReceiveBusiness(business))
        console.log("print server response inside onSubmit function")
        console.log(res)

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
        history.push(`/businesses/${res.id}`);
        return null;
    }
    return(
        <div className = "formWrapper">
            {/* might need to specify some kind of form method for python backend? */}
        <form onSubmit={onSubmit}>
            <div>
                <input type="text" name="name" placeholder="Name"
                        value={name} onChange={e => setName(e.target.value)}
                    />
            </div>
            {valErrors.name && <p>{valErrors.name}</p>}

            {/* change to textarea later */}
            <div>
                <input type="text" name="description" placeholder="Description"
                        value={description} onChange={e => setDescription(e.target.value)}
                    />
            </div>
            {valErrors.description && <p>{valErrors.description}</p>}

            <div>
            <input type="text" name="address" placeholder="Address"
                        value={address} onChange={e => setAddress(e.target.value)}
                    />
            </div>
            {valErrors.address && <p>{valErrors.address}</p>}

            <div>
                <input type="text" name="city" placeholder="City"
                        value={city} onChange={e => setCity(e.target.value)}
                    />
            </div>
            {valErrors.city && <p>{valErrors.city}</p>}

            <div>
                <input type="text" name="state" placeholder="State"
                        value={state} onChange={e => setState(e.target.value)}
                    />
            </div>
            {valErrors.state && <p>{valErrors.state}</p>}

            <div>
                <input type="text" name="prev_url" placeholder="Preview Image Url"
                        value={prev_url} onChange={e => setPrevUrl(e.target.value)}
                    />
            </div>
            {valErrors.prev_url && <p>{valErrors.prev_url}</p>}

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

            <button type="submit">Submit</button>
        </form>
        </div>
    )
}
