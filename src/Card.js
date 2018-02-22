import React, { Component } from "react";
import Rating from "./Rating";
import DropDown from "./DropDown";

class Card extends Component {
  state = {
    isVisible: false,
    isLeaving: false
  };

  componentDidMount() {
    this.setState({ isVisible: true });
  }

  onItemAction(category) {
    if(!this.state.isLeaving) {
      this.setState({ isLeaving: true});
      this.props.onItemAction(category);
    }
  }

  onShowMoreInfo(itemID) {
    if(!this.state.isLeaving) {
      this.props.onShowMoreInfo(itemID);
    }
  }

  render() {
    const self = this;
    const { item } = this.props;

    // Dynamic classes:
    // show animation
    const showClass = self.state.isVisible ? " is-visible" : "";

    // leave animation
    const leaveClass = self.state.isLeaving ? " is-leaving" : "";

    const imageStyling = {
      background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.4)), url(${
        item.imageLinks.smallThumbnail
      }) no-repeat center bottom`,
      backgroundSize: "cover"
    };

    return (
      <li className={`my-card${showClass}${leaveClass}`}>
        <div className="my-card-content">
        <div className="loader"></div>
          <div className="my-card-thumbnail" style={imageStyling} />
          <div
            className="my-card-more has-text-centered"
            onClick={() => self.onShowMoreInfo(item.id)}
          >
            <span className="icon">
              <i className="fas fa-ellipsis-h" />
            </span>
          </div>
          <div className="my-card-info">
            <div className="my-card-dropdown">
              <DropDown
                options={self.props.categoryValues}
                onSelect={category => self.onItemAction(category)}
                isRight={true}
                onlyArrow={true}
                itemID={item.id}
              />
            </div>
            <div className="my-card-header">
              <h3 className="my-card-title">{item.title}</h3>
              <p className="my-card-authors is-size-7">
                {item.authors.join(", ")}
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
