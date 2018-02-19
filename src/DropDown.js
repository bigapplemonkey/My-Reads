import React, { Component } from 'react';

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
            optionSelected: 'All'
        };
    }

    handleClick() {
        if (!this.state.isExpanded) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded,
        }));
    }

    onSelect(optionSelected) {
      this.setState({optionSelected});
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

        return (
          <div className={`my-dropdown dropdown ${this.state.isExpanded ? 'is-active': ''}`}>
            <div className="dropdown-trigger"
            onClick={(event) => {
              event.preventDefault();
              self.handleClick(event)}
            }
            ref={node =>  self.node = node }>
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu3">
                <span>{self.state.optionSelected.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})}</span>
                <span className="icon is-small">
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {Array.from(self.props.options).sort().map(option => {
                    return(
                      <a href="" key={option} className="dropdown-item"
                      onClick={(event) => {
                        event.preventDefault();
                        self.onSelect(option, event);
                      }}>
                        {option.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})}
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