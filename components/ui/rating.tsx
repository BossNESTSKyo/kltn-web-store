import React from "react";
import StarRatings from "react-star-ratings";

interface RatingProps {
  rating: any;
  setRating: any;
}

const Rating: React.FC<RatingProps> = ({ rating, setRating }) => {
  const roundedRating = Math.round(rating);

  return (
    <StarRatings
      rating={roundedRating}
      starRatedColor="gold"
      changeRating={setRating}
      numberOfStars={5}
      name="rating"
      starDimension="20px"
      starSpacing="3px"
    />
  );
};

export default Rating;
