export const LOAD_BUSINESSES = 'businesses/LOAD_BUSINESSES';
export const LOAD_SINGLE_BUS = "businesses/LOAD_SINGLE_BUS";
export const RECEIVE_BUS = 'businesses/RECEIVE_BUS';
export const UPDATE_BUS = 'businesses/UPDATE_BUS';
export const REMOVE_BUS = 'businesses/REMOVE_BUS';

const actionLoadBusinesses = (businesses) => {
    return {
        type: LOAD_BUSINESSES,
        businesses
    }
}
export const thunkLoadBusinesses = () => async (dispatch) => {
    const res = await fetch("/api/businesses/");
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadBusinesses(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

export const thunkLoadBusinessesQuery = (query) => async (dispatch) => {
    const res = await fetch(`/api/businesses/${query}`);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadBusinesses(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

export const thunkLoadRecentBusinesses = (limit) => async (dispatch) => {
    const res = await fetch(`/api/businesses/recent/${limit}`);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadBusinesses(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

export const thunkLoadBusinessesOfUser = () => async (dispatch) => {
    const res = await fetch("/api/businesses/current");
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadBusinesses(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

export const thunkLoadFavBusinessesOfUser = () => async (dispatch) => {
    const res = await fetch("/api/businesses/current/favorites");
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadBusinesses(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

const actionLoadSingleBusiness = (singleBus) => {
    return {
        type: LOAD_SINGLE_BUS,
        singleBus
    }
}
export const thunkLoadSingleBusiness = (business_id) => async (dispatch) => {
    const res = await fetch(`/api/businesses/${business_id}`);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadSingleBusiness(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

const actionReceiveBusiness = (business) => {
    return {
        type: RECEIVE_BUS,
        business
    }
}
export const thunkReceiveBusiness = (business) => async (dispatch) => {
    const options = {
        method: "Post",
        body: business
    }

    const res = await fetch(`/api/businesses/`, options);
    if(res.ok)
    {
        const serverData = await res.json()
        dispatch(actionReceiveBusiness(serverData))
        return serverData;
    }
    else
    {
        const errorData = await res.json()
        return errorData;
    }
}
const actionUpdateBusiness = (business) => {
    return {
        type: UPDATE_BUS,
        business
    }
}
export const thunkUpdateBusiness = (id, business) => async (dispatch) => {
    const options = {
        method: "Put",
        body: business
    }

    const res = await fetch(`/api/businesses/${id}`, options);
    if(res.ok)
    {
        const serverData = await res.json()
        dispatch(actionUpdateBusiness(serverData))
        return serverData;
    }else
    {
        const errorData = await res.json()
        return errorData;
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

    const res = await fetch(`/api/businesses/${id}`, options);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionDeleteBusiness(id));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
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
