import React, { Component } from "react";

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

  handleClick() {
    if (!this.state.isExpanded) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  handleOutsideClick(event) {
    // ignore clicks on the component itself
    if (this.node.contains(event.target)) {
      return;
    }

    this.handleClick();
  }

  componentWillUnmount() {
    // remove event listener before losing ref in the component
    document.removeEventListener("click", this.handleOutsideClick, false);
  }

  // notify parent component
  onSelect(optionSelected, event) {
    event.preventDefault();

    this.setState({ optionSelected });
    // if the component relates to an item which ID could be used
    if (this.props.hasOwnProperty("itemID"))
      optionSelected["itemID"] = this.props.itemID;

    this.props.onSelect(optionSelected);
  }

  expand(event) {
    event.preventDefault();

    if (!this.state.isExpanded) this.setState({ isExpanded: true });
  }

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
    if (self.props.hasOwnProperty("isOrdered") && self.props.isOrdered)
      options = options.sort((option1, option2) => {
        let option1Value = option1.value.toUpperCase();
        let option2Value = option2.value.toUpperCase();
        return option1Value < option2Value
          ? -1
          : option1Value > option2Value ? 1 : 0;
      });

    // Dynamic classes:
    // menu alignment
    const alignmentClass = self.props.isRight ? " is-right" : "";
    // expanding class - trigger animation
    const expandedClass = self.state.isExpanded ? " is-active" : "";

    return (
      <div className={`my-dropdown dropdown ${alignmentClass}${expandedClass}`}>
        <div
          className="dropdown-trigger"
          onClick={event => self.handleClick(event)}
          ref={node => (self.node = node)}
        >
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            {self.props.onlyArrow ? (
              ""
            ) : (
              <span>
                {self.correctCapitalization(self.state.optionSelected.value)}
              </span>
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

export default DropDown;
