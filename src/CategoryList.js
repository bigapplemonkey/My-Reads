import React, { Component } from "react";
import Card from "./Card";
import DropDown from "./DropDown";
import Search from "./Search";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "All"
    };
    this.onSelect = this.onSelect.bind(this);
    this.onShowMoreInfo = this.onShowMoreInfo.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onSelect(category) {
    this.setState({ category });
  }

  onShowMoreInfo(itemID) {
    this.props.onShowMoreInfo(itemID);
  }

  onSearch(query) {
    console.log(query);
  }

  render() {
    const self = this;

    let categories = new Set([]);
    categories.add("All");

    self.props.items.forEach(item => {
      if (item.categories)
        item.categories.forEach(category => categories.add(category));
      else categories.add("No Category");
    });

    let items = self.props.items;

    if (self.state.category !== "All") {
      items = items.filter(item => {
        if (item.categories)
          return item.categories.includes(self.state.category);
        return self.state.category === "No Category";
      });
    }

    return (
      <section
        className={`container my-cards-container ${
          self.props.isVisible ? "is-visible" : ""
        }`}
      >
        <div className="dropdown-container">
          <Search onUpdate={self.onSearch} />
          <DropDown options={categories} onSelect={this.onSelect} />
        </div>
        <ul className="my-cards-grid is-multiline is-vcentered">
          {items.map(item => (
            <Card
              key={item.id}
              item={item}
              onShowMoreInfo={self.onShowMoreInfo}
            />
          ))}
        </ul>
      </section>
    );
  }
}

export default CategoryList;
