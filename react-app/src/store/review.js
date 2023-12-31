export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const LOAD_SINGLE_REVIEW = "reviews/LOAD_SINGLE_REVIEW";
export const RECEIVE_REVIEW = 'reviews/RECEIVE_REVIEW';
export const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
export const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

const actionLoadReviews = (reviews) => {
    //reviews is an array of review objects
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}
export const thunkLoadReviews = () => async (dispatch) => {
    try {
        const res = await fetch("/api/reviews/");
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionLoadReviews(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            return errorData;
        }
    } catch (error){
    }
}


export const thunkLoadReviewsOfUser = () => async (dispatch) => {
    try {
        const res = await fetch("/api/reviews/current");
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionLoadReviews(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            return errorData;
        }
    } catch (error){
    }
}

const actionLoadSingleReview = (singleRev) => {
    return {
        type: LOAD_SINGLE_REVIEW,
        singleRev
    }
}
export const thunkLoadSingleReview = (review_id) => async (dispatch) => {
    try {
        const res = await fetch(`/api/reviews/${review_id}`);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionLoadSingleReview(serverData));
            return serverData;
        } else{
            const errorData = await res.json();
            return errorData;
        }
    } catch (error){
    }
}

const actionReceiveReview = (review) => {
    return {
        type: RECEIVE_REVIEW,
        review
    }
}
export const thunkReceiveReview = (bus_id, review) => async (dispatch) => {
    try {
        const options = {
            method: "Post",
            body: review
        };
        const res = await fetch(`/api/businesses/${bus_id}/reviews`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionReceiveReview(serverData));
            return serverData;
        }else {
            const errorData = await res.json();
            return errorData;
        }
    } catch (error){
    }
}

const actionUpdateReview = (review) => {
    return {
        type: UPDATE_REVIEW,
        review
    }
}
export const thunkUpdateReview = (id, review) => async (dispatch) => {
    try {
        const options = {
            method: "Put",
            body: review
        }
        const res = await fetch(`/api/reviews/${id}`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionUpdateReview(serverData));
            return serverData;
        }else {
            const errorData = await res.json()
            return errorData;
        }
    } catch (error){
    }
}

const actionDeleteReview = (rev_id) => {
    return {
        type: REMOVE_REVIEW,
        rev_id
    }
}
export const thunkDeleteReview = (id) => async (dispatch) => {
    const options = {
        method: "Delete"
    }
    try{
        const res = await fetch(`/api/reviews/${id}`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionDeleteReview(id));
            return serverData;
        } else {
            const errorData = await res.json();
            return errorData;
        }
    } catch(error){
    }
}

const initialState = {
    allRev: {},
    singleRev: {}
}

const revReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS:
            const normReviews = {};
            action.reviews.forEach(ele => {
                normReviews[ele.id] = ele;
            })
            return {...state, allRev: normReviews}
        case LOAD_SINGLE_REVIEW:
            return {...state, singleRev: {...action.singleRev}}
        case RECEIVE_REVIEW:
            return {
                ...state,
                allRev: {...state.allRev, [action.review.id]: action.review  },
                singleRev: {...action.review}
            }
        case UPDATE_REVIEW:
            return {
                ...state,
                allRev: {...state.allRev, [action.review.id]: action.review  },
                singleRev: {...state.singleRev, ...action.review}
            }
        case REMOVE_REVIEW:
            const newAllRev = {...state.allRev};
            delete newAllRev[action.rev_id];
            return {allRev: newAllRev, singleRev: {}}
        default:
            return state;
    }
}

export default revReducer;
