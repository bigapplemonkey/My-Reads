// React packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Card from './Card';
import DropDown from './DropDown';
import Search from './Search';

class CategoryList extends Component {
  state = {
    category: 'All',
    isProcessing: false
  };

  // when component mounts uodate page title and notify parent
  componentDidMount() {
    document.title = this.props.pageTitle;
    this.props.onDisplay(this.props.category);
  }

  // handle item category selection inside component
  onSelect(category) {
    if (category.id !== this.state.category) {
      this.setState({ isProcessing: true }, () =>
        this.setState({ category: category.id }, () => {
          setTimeout(() => this.setState({ isProcessing: false }), 10); // small delay to let items animate
        })
      );
    }
  }

  // notify parent to open modal
  onShowMoreInfo(item) {
    this.props.onShowMoreInfo(item);
  }

  // notify parent to do a search
  onSearch(query) {
    // remove category selection when no query
    if (query === '') {
      this.setState({ category: 'All' });
    }
    this.props.onSearch(query);
  }

  render() {
    const self = this;

    // item category list
    let categories = [{ value: 'All', id: 'All' }];

    let items = self.props.items ? self.props.items : [];

    // get all categories
    items.forEach(item => {
      if (item.categories)
        item.categories.forEach(category =>
          categories.push({ value: category, id: category })
        );
      else categories.push({ value: 'No Category', id: 'No Category' });
    });

    // filter items based on category
    if (self.state.category !== 'All') {
      items = items.filter(item => {
        if (item.categories)
          return item.categories
            .map(category => category.toLowerCase())
            .includes(self.state.category.toLowerCase());
        return self.state.category === 'No Category';
      });
    }

    // Dynamic classes:
    // show cards
    const cardsShowClass = self.props.isProcessing ? ' is-processing' : '';

    //no items class / message
    let emptyShowClass = '';
    let noItemsMessage = '';
    if (items.length === 0 && !self.props.isProcessing) {
      emptyShowClass = ' is-empty';
      noItemsMessage =
        self.state.category !== 'All'
          ? `No books in ${self.state.category}`
          : 'No books in this shelf';
    }

    return (
      <section
        className={`container my-cards-container is-visible${cardsShowClass}`}
      >
        <div className="dropdown-container">
          {self.props.isSearch && (
            <Search onUpdate={self.onSearch.bind(self)} />
          )}
          <DropDown
            externalClass="hidden-mobile"
            options={categories}
            onSelect={self.onSelect.bind(self)}
            isOrdered={true}
            optionSelected={self.state.category}
          />
        </div>
        <div className="my-loader" />
        <div className={`no-items has-text-centered${emptyShowClass}`}>
          <i className="fas fa-book" />
          <strong>{noItemsMessage}</strong>
        </div>
        <ul className="my-cards-grid is-multiline is-vcentered">
          {items.map(item => (
            <Card
              key={item.id}
              item={item}
              onItemAction={category =>
                self.props.onItemAction(item, category.id)
              }
              onShowMoreInfo={self.onShowMoreInfo.bind(self)}
              categoryValues={self.props.categoryValues}
              isProcessing={self.props.isProcessing || self.state.isProcessing}
            />
          ))}
        </ul>
      </section>
    );
  }
}

CategoryList.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  onDisplay: PropTypes.func,
  category: PropTypes.string.isRequired,
  categoryValues: PropTypes.array.isRequired,
  onItemAction: PropTypes.func.isRequired,
  onShowMoreInfo: PropTypes.func.isRequired,
  isSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  isProcessing: PropTypes.bool.isRequired
};

export default CategoryList;
