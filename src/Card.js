import React, { Component } from "react";

class Card extends Component {
  onShowMoreInfo(itemID) {
    console.log(itemID);
    this.props.onShowMoreInfo(itemID);
  }

  render() {
    const self = this;
    const { item } = this.props;

    return (
      <li className="my-card">
        <div className="my-card-content">
          <div
            className="my-card-thumbnail"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.4)), url(${
                item.imageLinks.smallThumbnail
              }) no-repeat center bottom`,
              backgroundSize: "cover"
            }}
          />
          <div
            className="my-card-more has-text-centered"
            onClick={() => self.onShowMoreInfo(item.id)}
          >
            <span className="icon">
              <i className="fas fa-ellipsis-h" />
            </span>
          </div>
          <div className="my-card-info">
            <div className="my-card-header">
              <h3 className="my-card-title">{item.title}</h3>
              <p className="my-card-authors is-size-7">
                {item.authors.join(", ")}
              </p>
            </div>
            <div className="my-card-rating">
              <div className="star-rating">
                <span>☆</span>
                <span>☆</span>
                <span>☆</span>
                <span>☆</span>
                <span>☆</span>
                <div
                  className="star-rating__current"
                  style={{
                    width: item.averageRating
                      ? `${(item.averageRating / 5 * 100).toFixed(2)}%`
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
                  {item.ratingsCount ? item.ratingsCount : 0}
                </p>
                <div className="icon reviewer-icon">
                  <i className="fas fa-users" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default Card;
