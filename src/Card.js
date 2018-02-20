import React, { Component } from "react";
import Rating from "./Rating";

class Card extends Component {
  state = {
    isVisible: false
  }
  onShowMoreInfo(itemID) {
    this.props.onShowMoreInfo(itemID);
  }

  componentDidMount() {
    this.setState({isVisible: true});
  }

  render() {
    const self = this;
    const { item } = this.props;

    return (
      <li className={`my-card ${self.state.isVisible ? 'is-visible' : ''}`}>
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
              <Rating averageRating={item.averageRating} ratingsCount={item.ratingsCount ? item.ratingsCount : 0}/>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default Card;
