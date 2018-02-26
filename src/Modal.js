// React packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Rating from './Rating';

class Modal extends Component {
  state = {
    isVisible: false,
    isImageLoaded: false
  };

  // trigger animation when show
  componentDidMount() {
    this.setState({ isVisible: true });
  }

  // check image is loaded before showing modal
  imageLoaded() {
    this.setState({ isImageLoaded: true });
  }

  // removing background scroll when modal is open
  onDisplay(isVisible) {
    let $html = document.getElementsByTagName('html');
    isVisible
      ? $html[0].classList.add('is-clipped')
      : $html[0].classList.remove('is-clipped');
  }

  // closing modal when there's a click ouside of modal
  // notifying parent if closed
  handleClick(event) {
    if (this.node.contains(event.target)) {
      return;
    }
    this.onDisplay(false);
    this.props.onHidden();
  }

  render() {
    const self = this;
    const { item } = self.props;

    // remove scrolling
    self.onDisplay(self.props.isVisible);

    // Dynamic classes:
    // show modal - trigger animation
    const showModalClass =
      self.props.isVisible && self.state.isVisible ? ' is-active' : '';

    //trigger modal content animation
    const showContentClass = self.state.isImageLoaded ? ' with-image' : '';

    // merge title and subtitle
    const itemTitle = item.subtitle
      ? `${item.title}: ${item.subtitle}`
      : item.title;
    // check if image path
    const imagePath = item.imageLinks
      ? item.imageLinks.thumbnail
      : './image_holder_opt.png';
    // merge authors
    const itemAuthors = item.authors ? item.authors.join(', ') : 'Anonymous';
    // get published year
    const itemYear = item.publishedDate
      ? ` - ${item.publishedDate.split('-')[0]}`
      : '';

    // cut long text off
    let itemDescription = '';
    if (item.description) {
      itemDescription =
        item.description.length > 500
          ? `${item.description.substring(0, 496)}...`
          : item.description;
    }

    return (
      <div
        className={`modal${showModalClass}`}
        onClick={event => self.handleClick(event)}
      >
        <div className="modal-background" />
        <div className={`modal-content${showContentClass}`}>
          <div className="box" ref={node => (self.node = node)}>
            <article className="media">
              <div className="media-left">
                <figure className="image is-2by3">
                  <img
                    src={imagePath}
                    alt={item.title}
                    onLoad={self.imageLoaded.bind(self)}
                  />
                </figure>
                <div className="modal-rating">
                  <Rating
                    averageRating={item.averageRating}
                    ratingsCount={item.ratingsCount ? item.ratingsCount : 0}
                  />
                </div>
              </div>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>{itemTitle}</strong>
                    <br />
                    <small>{itemAuthors}</small>
                    {itemYear}
                    <br />
                    <br />
                    {itemDescription}
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

Modal.propTypes = {
  item: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onHidden: PropTypes.func.isRequired
};

export default Modal;
