// React packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Search extends Component {
  // clear value when clear icon is clicked
  clearValue() {
    this.input.value = '';
    this.props.onUpdate('');
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
            ref={node => (self.input = node)}
            onChange={event => self.props.onUpdate(event.target.value.trim())}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>

          <span className="icon is-small is-right">
            <i className="fas fa-times" />
          </span>
        </p>
        <div className="my-search-clear" onClick={self.clearValue.bind(self)} />
      </div>
    );
  }
}

Search.propTypes = {
  onUpdate: PropTypes.func.isRequired
};

export default Search;
