import React, { Component } from 'react';

class Modal extends Component {
  render() {
    const self = this;
    console.log(self.props);
    const { item, isVisible } = this.props;

    return (
      <div className={`modal ${isVisible ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <article className="media">
              <div className="media-left">
                <figure className="image is-2by3">
                  <img src={item.imageLinks.thumbnail} alt=""/>
                </figure>
              </div>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>{item.title}</strong> <small>{item.authors.join(', ')}</small> - {item.publishedDate.split('-')[0]}
                    <br/>
                    <br/>
                    {item.description.length > 300 ? `${item.description.substring(0, 280)}...` : item.description}
                  </p>
                </div>
                <nav className="level is-mobile">
                  <div className="level-left">
                    <a href={item.previewLink} className="level-item" target="_blank">
                      <span className="icon is-small"><i className="fas fa-external-link-alt"></i></span>
                    </a>
                    <a href={item.infoLink} className="level-item" target="_blank">
                      <span className="icon is-small"><i className="fab fa-google-play"></i></span>
                    </a>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
        <button className="modal-close is-large"></button>
      </div>
    );
  }
}

export default Modal;