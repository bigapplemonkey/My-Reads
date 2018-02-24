import React, { Component } from "react";
import Rating from "./Rating";
import DropDown from "./DropDown";

class Card extends Component {
  state = {
    isVisible: false
  };

  componentDidMount() {
    this.setState({ isVisible: true });
  }

  render() {
    const self = this;
    const { item } = this.props;

    // Dynamic classes:
    // show animation
    const showClass =
      self.state.isVisible && !self.props.isProcessing ? " is-visible" : "";

    let imagePath;
    let fitType;
    let verticalAlign;

    if (item.imageLinks && item.imageLinks.smallThumbnail) {
      imagePath = item.imageLinks.smallThumbnail;
      fitType = "cover";
      verticalAlign = "bottom";
    } else {
      imagePath = "/image_holder_opt.png";
      fitType = "auto";
      verticalAlign = "center";
    }

    const imageStyling = {
      background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.4)), url(${imagePath}) no-repeat center ${verticalAlign}`,
      backgroundSize: fitType
    };

    return (
      <li className={`my-card${showClass}`}>
        <div className="my-card-content">
          <div className="my-card-thumbnail" style={imageStyling} />
          <div
            className="my-card-more has-text-centered"
            onClick={() => self.props.onShowMoreInfo(item.id)}
          >
            <span className="icon">
              <i className="fas fa-ellipsis-h" />
            </span>
          </div>
          <div className="my-card-info">
            <div className="my-card-dropdown">
              <DropDown
                options={self.props.categoryValues}
                onSelect={category => self.props.onItemAction(category)}
                isRight={true}
                onlyArrow={true}
              />
            </div>
            <div className="my-card-header">
              <h3 className="my-card-title">{item.title}</h3>
              <p className="my-card-authors is-size-7">
                {item.authors ? item.authors.join(", ") : "Anonymous"}
              </p>
            </div>
            <div className="my-card-rating">
              <Rating
                averageRating={item.averageRating}
                ratingsCount={item.ratingsCount ? item.ratingsCount : 0}
              />
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default Card;
