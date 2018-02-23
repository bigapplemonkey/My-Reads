import React, { Component } from "react";
import Card from "./Card";
import DropDown from "./DropDown";
import Search from "./Search";

class CategoryList extends Component {
  state = {
    category: "All",
    isProcessing: false
  };

  onSelect(category) {
    if (category.id !== this.state.category) {
      this.setState({ isProcessing: true }, () =>
        this.setState({ category: category.id }, () => {
          setTimeout(() => this.setState({ isProcessing: false }), 10);
        })
      );
    }
  }

  onShowMoreInfo(itemID) {
    this.props.onShowMoreInfo(itemID);
  }

  onSearch(query) {
    console.log(query);
  }

  componentDidMount() {
    console.log("Mounted...");
  }

  componentWillUnmount() {
    console.log("Un-mounting...");
  }

  render() {
    const self = this;

    let categories = [{ value: "All", id: "All" }];

    self.props.items.forEach(item => {
      if (item.categories)
        item.categories.forEach(category =>
          categories.push({ value: category, id: category })
        );
      else categories.push({ value: "No Category", id: "No Category" });
    });

    let items = self.props.items;

    if (self.state.category !== "All") {
      items = items.filter(item => {
        if (item.categories)
          return item.categories
            .map(category => category.toLowerCase())
            .includes(self.state.category.toLowerCase());
        return self.state.category === "No Category";
      });
    }

    let categoryValues = self.props.categoryValues.map(category => {
      return {
        value: category.value,
        id: category.id,
        isDisabled: category.id === self.props.category ? true : false
      };
    });

    categoryValues.push({ value: "None", id: "none" });

    // Dynamic classes:
    // show animation
    const showClass = self.props.isVisible ? " is-visible" : "";

    // show cards
    const cardsShowClass = self.props.isProcessing ? " is-processing" : "";

    //no items class
    let emptyShowClass = "";
    let noItemsMessage = "";
    if (items.length === 0) {
      emptyShowClass = " is-empty";
      noItemsMessage =
        self.state.category !== "All"
          ? `No books in ${self.state.category}`
          : "No books in this shelf";
    }

    return (
      <section
        className={`container my-cards-container${showClass}${cardsShowClass}`}
      >
        <div className="dropdown-container">
          <Search onUpdate={self.onSearch.bind(self)} />
          <DropDown
            options={categories}
            onSelect={self.onSelect.bind(self)}
            isOrdered={true}
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
                self.props.onItemAction(item, category.id, self.props.category)
              }
              onShowMoreInfo={self.onShowMoreInfo.bind(self)}
              categoryValues={categoryValues}
              isProcessing={self.props.isProcessing || self.state.isProcessing}
            />
          ))}
        </ul>
      </section>
    );
  }
}

export default CategoryList;
