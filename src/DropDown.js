import React, { Component } from "react";

class DropDown extends Component {
  //Handle click outside of React component
  //https://codepen.io/graubnla/pen/EgdgZm
  //How to capitalize first letter of each word
  //https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {
      isExpanded: false,
      optionSelected: props.options
        ? props.options[0]
        : { value: "All", id: "All" }
    };
  }

  handleClick() {
    if (!this.state.isExpanded) {
      // attach/remove event handler
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick, false);
  }

  onSelect(optionSelected) {
    this.setState({ optionSelected });
    if (this.props.hasOwnProperty("itemID"))
      optionSelected["itemID"] = this.props.itemID;
    this.props.onSelect(optionSelected);
  }

  handleOutsideClick(event) {
    // ignore clicks on the component itself
    if (this.node.contains(event.target)) {
      return;
    }

    this.handleClick();
  }

  expand(event) {
    event.preventDefault();
    if (!this.state.isExpanded) this.setState({ isExpanded: true });
  }
  render() {
    const self = this;

    let options = self.props.options.filter(
      (thing, index, self) =>
        self.findIndex(t => t.id.toLowerCase() === thing.id.toLowerCase()) ===
        index
    );

    if (self.props.hasOwnProperty("isOrdered") && self.props.isOrdered)
      options = options.sort((option1, option2) => {
        let textA = option1.value.toUpperCase();
        let textB = option2.value.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

    return (
      <div
        className={`my-dropdown dropdown ${
          self.props.isRight ? "is-right" : ""
        } ${self.state.isExpanded ? "is-active" : ""}`}
      >
        <div
          className="dropdown-trigger"
          onClick={event => {
            event.preventDefault();
            self.handleClick(event);
          }}
          ref={node => (self.node = node)}
        >
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu3"
          >
            {self.props.onlyArrow ? (
              ""
            ) : (
              <span>
                {self.state.optionSelected.value.replace(/\w\S*/g, function(
                  txt
                ) {
                  return (
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                  );
                })}
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
                  {option.value.replace(/\w\S*/g, function(txt) {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
                  <span className="icon is-small dropdown-icon">
                    <i className="fas fa-check" />
                  </span>
                </p>
              ) : (
                <a
                  href=""
                  key={option.id}
                  className="dropdown-item"
                  onClick={event => {
                    event.preventDefault();
                    self.onSelect(option, event);
                  }}
                >
                  {option.value.replace(/\w\S*/g, function(txt) {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
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
