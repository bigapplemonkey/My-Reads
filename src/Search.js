import React, { Component } from "react";

class Search extends Component {
  clearValue() {
    console.log("heyyyyy");
    this.input.value = "";
  }

  render() {
    const self = this;

    return (
      <div className="my-search field">
        <p className="control is-expanded has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            placeholder="Search"
            ref={el => (self.input = el)}
            onChange={event => self.props.onUpdate(event.target.value.trim())}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>

          <span className="icon is-small is-right">
            <i className="fas fa-times" />
          </span>
        </p>
        <div className="my-search-clear" onClick={() => self.clearValue()} />
      </div>
    );
  }
}

export default Search;
