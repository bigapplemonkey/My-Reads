import React, { Component } from "react";
import Rating from "./Rating";

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      isImageLoaded: false
    };

    this.imageLoaded = this.imageLoaded.bind(this);
  }

  componentDidMount() {
    this.setState({isVisible: true});
  }

  imageLoaded() {
    this.setState({isImageLoaded: true});
  }

  onDisplay(isVisible) {
    let $html = document.getElementsByTagName("html");
    isVisible
      ? $html[0].classList.add("is-clipped")
      : $html[0].classList.remove("is-clipped");
  }

  handleClick(event) {
    if (this.node.contains(event.target)) {
      return;
    }
    this.props.onHidden();
  }

  render() {
    const self = this;
    const { item } = self.props;

    self.onDisplay(self.props.isVisible);

    return (
      <div
        className={`modal ${(self.props.isVisible && self.state.isVisible) ? "is-active" : ""}`}
        onClick={event => self.handleClick(event)}
      >
        <div className="modal-background" />
        <div className={`modal-content ${self.state.isImageLoaded ? "with-image" : ""}`}>
          <div className="box" ref={node => (self.node = node)}>
            <article className="media">
              <div className="media-left">
                <figure className="image is-2by3">
                  <img
                    src={item.imageLinks.thumbnail} alt=""
                    onLoad={self.imageLoaded}
                  />
                </figure>
                <div className="modal-rating">
                 <Rating averageRating={item.averageRating} ratingsCount={item.ratingsCount ? item.ratingsCount : 0}/>
                </div>
              </div>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>{item.subtitle ? `${item.title}: ${item.subtitle}` : item.title}</strong>
                    <br/>
                    <small>{item.authors.join(", ")}</small> - {item.publishedDate.split("-")[0]}
                    <br />
                    <br />
                    {item.description.length > 500
                      ? `${item.description.substring(0, 496)}...`
                      : item.description}
                  </p>
                </div>
                <nav className="level is-mobile">
                  <div className="level-left">
                    <a
                      href={item.previewLink}
                      className="level-item"
                      target="_blank"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-external-link-alt" />
                      </span>
                    </a>
                    <a
                      href={item.infoLink}
                      className="level-item"
                      target="_blank"
                    >
                      <span className="icon is-small">
                        <i className="fab fa-google-play" />
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
        <button className="modal-close is-large" />
      </div>
    );
  }
}

export default Modal;
