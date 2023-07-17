import {useState, useEffect} from "react";

import "./StarRatingInput.css"

export default function StarRatingInput({ rating, onRatingChange, form })
{
  const [activeRating, setActiveRating] = useState(rating);

  function onMouseEnter(position)
  {
    if(form) setActiveRating(position);
  }
  function onMouseLeave()
  {
    if(form) setActiveRating(rating);
  }
  useEffect(() => {
    setActiveRating(rating);
  },[rating])

  return (
      <div className="rating-input">
        {/* <div className={activeRating >= 1 ? "filled" : "empty"}> */}
        <div className =
            {
                form ?
                (activeRating >= 1 ? "filled" : "empty")
                :
                (activeRating >= 0.5 ? (activeRating >= 3 ? "filled" : "partial") : "empty" )
            }
        >
          <i className="fa-regular fa-star"
            onMouseEnter={() => onMouseEnter(1)}
            onMouseLeave={onMouseLeave}
            onClick ={() => onRatingChange(1)}
            >
            </i>
        </div>
        {/* <div className={activeRating >= 2 ? "filled" : "empty"}> */}
        <div className =
            {
                form ?
                (activeRating >= 2 ? "filled" : "empty")
                :
                (activeRating >= 1.5 ? (activeRating >= 3 ? "filled" : "partial") : "empty" )
            }
        >
            <i className="fa-regular fa-star"
              onMouseEnter={() => onMouseEnter(2)}
              onMouseLeave={onMouseLeave}
              onClick ={() => onRatingChange(2)}>
            </i>
        </div>
        {/* <div className={activeRating >= 3 ? "filled" : "empty"}> */}
        <div className=
            {
                form ?
                (activeRating >= 3 ? "filled" : "empty")
                :
                (activeRating >= 2.5 ? (activeRating >= 3 ? "filled" : "partial") : "empty" )
            }
        >
            <i className="fa-regular fa-star"
            onMouseEnter={() => onMouseEnter(3)}
            onMouseLeave={onMouseLeave}
            onClick ={() => onRatingChange(3)}>
            </i>
        </div>
        {/* <div className={activeRating >= 4 ? "filled" : "empty"}> */}
        <div className =
            {
                form ?
                (activeRating >= 4 ? "filled" : "empty")
                :
                (activeRating >= 3.5 ? (activeRating >= 3 ? "filled" : "partial") : "empty" )
            }
        >
            <i className="fa-regular fa-star"
              onMouseEnter={() => onMouseEnter(4)}
              onMouseLeave={onMouseLeave}
              onClick ={() => onRatingChange(4)}>
              </i>
        </div>
        {/* <div className={activeRating >= 5 ? "filled" : "empty"}> */}
        <div className =
            {
                    form ?
                    (activeRating >= 5 ? "filled" : "empty")
                    :
                    (activeRating >= 4.5 ? (activeRating >= 3 ? "filled" : "partial") : "empty" )
            }
        >
              <i className="fa-regular fa-star"
                onMouseEnter={() => onMouseEnter(5)}
                onMouseLeave={onMouseLeave}
                onClick ={() => onRatingChange(5)}>
              </i>
        </div>
    </div>

  );
};
