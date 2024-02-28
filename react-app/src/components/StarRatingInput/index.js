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
        <div className={activeRating >= 1 ? "filled" : (form ? "empty" : "hide")}>
          <i className="fa-regular fa-star"
            onMouseEnter={() => onMouseEnter(1)}
            onMouseLeave={onMouseLeave}
            onClick ={() => onRatingChange(1)}
            >
            </i>
        </div>

        <div className={activeRating >= 2 ? "filled" : (form ? "empty" : "hide")}>
            <i className="fa-regular fa-star"
              onMouseEnter={() => onMouseEnter(2)}
              onMouseLeave={onMouseLeave}
              onClick ={() => onRatingChange(2)}>
            </i>
        </div>

        <div className={activeRating >= 3 ? "filled" : (form ? "empty" : "hide")}>
            <i className="fa-regular fa-star"
            onMouseEnter={() => onMouseEnter(3)}
            onMouseLeave={onMouseLeave}
            onClick ={() => onRatingChange(3)}>
            </i>
        </div>

        <div className={activeRating >= 4 ? "filled" : (form ? "empty" : "hide")}>
            <i className="fa-regular fa-star"
              onMouseEnter={() => onMouseEnter(4)}
              onMouseLeave={onMouseLeave}
              onClick ={() => onRatingChange(4)}>
              </i>
        </div>

        <div className={activeRating >= 5 ? "filled" : (form ? "empty" : "hide")}>
              <i className="fa-regular fa-star"
                onMouseEnter={() => onMouseEnter(5)}
                onMouseLeave={onMouseLeave}
                onClick ={() => onRatingChange(5)}>
              </i>
        </div>
        <div className={!form && rating && (rating - Math.floor(rating) > .25) ? "filled" : "hide"}>
              <i className="fa-regular fa-star-half-stroke"></i>
        </div>
    </div>

  );
};
