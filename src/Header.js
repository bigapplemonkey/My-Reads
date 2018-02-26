// React packages
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Header extends Component {
  state = {
    isVisible: false
  };

  // trigger animation on show
  componentDidMount() {
    this.setState({ isVisible: true });
  }

  render() {
    const self = this;
    const { config, menuCounts } = self.props;

    // Dynamic classes:
    // header show animation
    const showClass = self.state.isVisible ? ' is-visible' : '';

    // header footer show animation
    const showFooterClass =
      self.state.isVisible && menuCounts ? ' is-visible' : '';

    // header footer show animation
    const highlightClass = self.props.isIncreaseUpdate ? ' pop-up' : ' pop-in';

    return (
      <header className={`hero is-warning${showClass}`}>
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column">
                <h1 className="title">{config.title}</h1>
                <h2 className="subtitle">{config.subTitle}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={`hero-foot${showFooterClass}`}>
          <nav className="tabs is-boxed">
            <div className="container">
              <ul>
                {config.menuOptions.map(option => {
                  return (
                    <li
                      key={option.id}
                      className={
                        self.props.selectedTab === option.id ? "is-active" : ""
                      }
                    >
                      <Link to={`${process.env.PUBLIC_URL}/${option.id}`}>
                        {option.id.includes("search") && (
                          <span className="icon is-small">
                            <i className="fas fa-search-plus" />
                          </span>
                        )}
                        <h2>{option.value}</h2>
                        {!option.id.includes("search") && (
                          <span
                            className={`item-count tag is-white is-rounded${
                              !self.props.isProcessing &&
                              self.props.updatedTab === option.id
                                ? highlightClass
                                : ""
                            }`}
                          >
                            {menuCounts[option.id]}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  config: PropTypes.object.isRequired,
  menuCounts: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  updatedTab: PropTypes.string.isRequired,
  isIncreaseUpdate: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired
};

export default Header;
