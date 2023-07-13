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

const actionLoadSingleReview = (singleRev) => {
    return {
        type: LOAD_SINGLE_REVIEW,
        singleRev
    }
}

const actionReceiveReview = (review) => {
    return {
        type: RECEIVE_REVIEW,
        review
    }
}

const actionUpdateReview = (review) => {
    return {
        type: UPDATE_REVIEW,
        review
    }
}

const actionDeleteReview = (rev_id) => {
    return {
        type: REMOVE_REVIEW,
        rev_id
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
