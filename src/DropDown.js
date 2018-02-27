// React packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * click Outside Component:
 * https://codepen.io/graubnla/pen/EgdgZm
 */
class DropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
      optionSelected: props.options[0]
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  // remove event listener before losing ref in the component
  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  // handle dropdown clicks
  handleClick() {
    if (!this.state.isExpanded) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  // handle clicks outside dropdown
  handleOutsideClick(event) {
    // ignore clicks on the component itself
    if (this.node.contains(event.target)) {
      return;
    }

    this.handleClick();
  }

  // notify parent component on select
  onSelect(optionSelected, event) {
    event.preventDefault();
    this.setState({ optionSelected });
    this.props.onSelect(optionSelected);
  }

  // expands dropdpwn on trigger click
  expand(event) {
    event.preventDefault();
    if (!this.state.isExpanded) this.setState({ isExpanded: true });
  }

  // helper to fix options' capitalization
  correctCapitalization(rawString) {
    return rawString.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
    );
  }

  render() {
    const self = this;

    // filter out duplicated option IDs
    let options = self.props.options.filter(
      (option, index, self) =>
        self.findIndex(t => t.id.toLowerCase() === option.id.toLowerCase()) ===
        index
    );

    // if items are requested to be sorted
    if (self.props.hasOwnProperty('isOrdered') && self.props.isOrdered)
      options = options.sort((option1, option2) => {
        let option1Value = option1.value.toUpperCase();
        let option2Value = option2.value.toUpperCase();
        return option1Value < option2Value
          ? -1
          : option1Value > option2Value ? 1 : 0;
      });

    // option displayed in the trigger
    const optionSelected = self.props.optionSelected
      ? self.props.optionSelected
      : self.state.optionSelected.value;

    // Dynamic classes:
    // menu alignment
    const alignmentClass = self.props.isRight ? ' is-right' : '';
    // expanding class - trigger animation
    const expandedClass = self.state.isExpanded ? ' is-active' : '';
    // external classes
    const externalClass = self.props.externalClass ? ` ${self.props.externalClass}` : '';

    return (
      <div className={`my-dropdown dropdown ${alignmentClass}${expandedClass}${externalClass}`}>
        <div className="dropdown-trigger" ref={node => (self.node = node)}>
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={self.handleClick}
          >
            {self.props.onlyArrow ? (
              ""
            ) : (
              <span>{self.correctCapitalization(optionSelected)}</span>
            )}
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {options.map(option => {
              return option.isDisabled ? (
                <p key={option.id} className="dropdown-item disabled">
                  {self.correctCapitalization(option.value)}
                  <span className="icon is-small dropdown-icon">
                    <i className="fas fa-check" />
                  </span>
                </p>
              ) : (
                <a
                  href=""
                  key={option.id}
                  className="dropdown-item"
                  onClick={event => self.onSelect(option, event)}
                >
                  {self.correctCapitalization(option.value)}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  isRight: PropTypes.bool,
  onlyArrow: PropTypes.bool,
  isOrdered: PropTypes.bool,
  optionSelected: PropTypes.string,
  externalClass: PropTypes.string
};

export default DropDown;
