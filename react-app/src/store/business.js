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

const actionLoadSingleBusiness = (singleBus) => {
    return {
        type: LOAD_SINGLE_BUS,
        singleBus
    }
}
const actionReceiveBusiness = (business) => {
    return {
        type: RECEIVE_BUS,
        business
    }
}
const actionUpdateBusiness = (business) => {
    return {
        type: UPDATE_BUS,
        business
    }
}
const actionDeleteBusiness = (bus_id) => {
    return {
        type: REMOVE_BUS,
        bus_id
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
    }
}

export default busReducer;
