export const LOAD_BUSINESSES = 'businesses/LOAD_BUSINESSES';
export const LOAD_SINGLE_BUS = "businesses/LOAD_SINGLE_BUS";
export const RECEIVE_BUS = 'businesses/RECEIVE_BUS';
export const UPDATE_BUS = 'businesses/UPDATE_BUS';
export const REMOVE_BUS = 'businesses/REMOVE_BUS';

const actionLoadBusinesses = (businesses) => {
    //businesses is an array of business objects
    return {
        type: LOAD_BUSINESSES,
        businesses
    }
}
export const thunkLoadBusinesses = () => async (dispatch) => {
    try {
        const res = await fetch("/api/businesses/");
        if(res.ok)
        {
            const serverData = await res.json();
            // console.log("good response from thunkLoadBusinesses")
            // console.log(serverData)
            dispatch(actionLoadBusinesses(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            // console.log("error response for thunkLoadSingleBusiness");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
    // console.log("CAUGHT error response for thunkLoadBusineeses")
    // console.log(error);
    }
}

export const thunkLoadBusinessesQuery = (query) => async (dispatch) => {
    try {
        const res = await fetch(`/api/businesses/${query}`);
        if(res.ok)
        {
            const serverData = await res.json();
            // console.log("good response from thunkLoadBusinesses")
            // console.log(serverData)
            dispatch(actionLoadBusinesses(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            // console.log("error response for thunkLoadSingleBusiness");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
    // console.log("CAUGHT error response for thunkLoadBusineeses")
    // console.log(error);
    }
}

export const thunkLoadBusinessesOfUser = () => async (dispatch) => {
    try {
        const res = await fetch("/api/businesses/current");
        if(res.ok)
        {
            const serverData = await res.json();
            // console.log("good response from thunkLoadBusinessesOfUser")
            // console.log(serverData)
            dispatch(actionLoadBusinesses(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            // console.log("error response for thunkBusinessesOfUser");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
    // console.log("CAUGHT error response for thunkLoadBusineesesOfUser")
    // console.log(error);
    }
}

export const thunkLoadFavBusinessesOfUser = () => async (dispatch) => {
    try {
        const res = await fetch("/api/businesses/current/favorites");
        if(res.ok)
        {
            const serverData = await res.json();
            // console.log("good response from thunkLoadFavBusinessesOfUser")
            // console.log(serverData)
            dispatch(actionLoadBusinesses(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            // console.log("error response for thunkLoadFavBusinessesOfUser");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
    // console.log("CAUGHT error response for thunkLoadFavBusineesesOfUser")
    // console.log(error);
    }
}

const actionLoadSingleBusiness = (singleBus) => {
    return {
        type: LOAD_SINGLE_BUS,
        singleBus
    }
}
export const thunkLoadSingleBusiness = (business_id) => async (dispatch) => {
    try {
        const res = await fetch(`/api/businesses/${business_id}`);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionLoadSingleBusiness(serverData));
            // console.log("good response for thunkLoadSingleBusiness");
            // console.log(serverData);
            return serverData;
        } else{
            const errorData = await res.json();
            // console.log("error response for thunkLoadSingleBusiness");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
        // console.log("CAUGHT error response for thunkLoadSingleBusiness");
        // console.log(error);
    }
}

const actionReceiveBusiness = (business) => {
    return {
        type: RECEIVE_BUS,
        business
    }
}
export const thunkReceiveBusiness = (business) => async (dispatch) => {
    try {
        const options = {
            method: "Post",
            body: business
        }
        const res = await fetch(`/api/businesses/`, options);
        if(res.ok)
        {
            const serverData = await res.json()
            dispatch(actionReceiveBusiness(serverData))
            // console.log("good response for thunkReceiveBusiness");
            // console.log(serverData);
            return serverData;
        }else {
            const errorData = await res.json()
            // console.log("error response for thunkReceiveBusiness");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
        // console.log("CAUGHT error response for thunkReceiveBusiness");
        // console.log(error);
    }
}
const actionUpdateBusiness = (business) => {
    return {
        type: UPDATE_BUS,
        business
    }
}
export const thunkUpdateBusiness = (id, business) => async (dispatch) => {
    try {
        const options = {
            method: "Put",
            body: business
        }
        const res = await fetch(`/api/businesses/${id}`, options);
        if(res.ok)
        {
            const serverData = await res.json()
            dispatch(actionUpdateBusiness(serverData))
            // console.log("good response for thunkUpdateBusiness");
            // console.log(serverData);
            return serverData;
        }else {
            const errorData = await res.json()
            // console.log("error response for thunkUpdateBusiness");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
        // console.log("CAUGHT error response for thunkUpdateBusiness");
        // console.log(error);
    }
}
const actionDeleteBusiness = (bus_id) => {
    return {
        type: REMOVE_BUS,
        bus_id
    }
}
export const thunkDeleteBusiness = (id) => async (dispatch) => {
    const options = {
        method: "Delete"
    }
    try{
        const res = await fetch(`/api/businesses/${id}`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionDeleteBusiness(id));
            // console.log("good response from thunkDeleteBusiness")
            // console.log(serverData)
            return serverData;
        } else {
            const errorData = await res.json();
            // console.log("error response for thunkDeleteBusiness");
            // console.log(errorData);
            return errorData;
        }
    } catch(error)
    {
        // console.log("CAUGHT error response for thunkDeleteBusiness");
        // console.log(error);
    }
}

const initialState = {
    allBus: {},
    singleBus: {}
}

const busReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_BUSINESSES:
            const normBusinesses = {};
            action.businesses.forEach(ele => {
                normBusinesses[ele.id] = ele;
            })
            return {...state, allBus: normBusinesses}
        case LOAD_SINGLE_BUS:
            return {...state, singleBus: {...action.singleBus}}
        case RECEIVE_BUS:
            return {
                ...state,
                allBus: {...state.allBus, [action.business.id]: action.business  },
                singleBus: {...action.business}
            }
        case UPDATE_BUS:
            return {
                ...state,
                allBus: {...state.allBus, [action.business.id]: action.business  },
                singleBus: {...state.singleBus, ...action.business}
            }
        case REMOVE_BUS:
            const newAllBus = {...state.allBus};
            delete newAllBus[action.bus_id];
            return {allBus: newAllBus, singleBus: {}}
        default:
            return state;
    }
}

export default busReducer;
