// React packages
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Start Rating:
 * https://codepen.io/christianhegedues/pen/OxyOBb/
 */
const Rating = props => (
  <div>
    <div className="star-rating">
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <div
        className="star-rating__current"
        style={{
          width: props.averageRating
            ? `${(props.averageRating / 5 * 100).toFixed(2)}%`
            : 0
        }}
      >
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
    </div>
    <div className="reviewers-count has-text-info has-text-centered">
      <p className="reviewer-count is-size-7">
        {props.ratingsCount ? props.ratingsCount : 0}
      </p>
      <div className="icon reviewer-icon">
        <i className="fas fa-users" />
      </div>
    </div>
  </div>
);

Rating.propTypes = {
  averageRating: PropTypes.number,
  ratingsCount: PropTypes.number
};

export default Rating;
