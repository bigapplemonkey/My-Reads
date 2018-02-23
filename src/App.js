import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import Header from "./Header";
import Footer from "./Footer";
import CategoryList from "./CategoryList";
import Modal from "./Modal";
import "./App.css";
import "./Custom.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAppReady: false,
      categorizedItems: {},
      categoryCount: {},
      queriedItems: [],
      selectedTab: this.appConfig.header.menuOptions[0].id,
      itemOnModalID: "",
      isModalVisible: false,
      updatedCategory: "",
      isProcessing: false
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onShowMoreInfo = this.onShowMoreInfo.bind(this);
    this.onHideMoreInfo = this.onHideMoreInfo.bind(this);
    this.onItemAction = this.onItemAction.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  appConfig = {
    header: {
      title: "My Reads",
      subTitle: "A Book Tracking App",
      menuOptions: [
        { value: "Currently Reading", id: "currentlyReading" },
        { value: "Want to Read", id: "wantToRead" },
        { value: "Read", id: "read" },
        { value: "Search", id: "search" }
      ]
    },
    footer: {
      projectName: "My Reads",
      authorName: "Jorge Asuaje",
      authorLink: "https://bigapplemonkey.github.io"
    }
  };

  categoryValues = this.appConfig.header.menuOptions.filter(
    category => category.id !== "search"
  );

  componentDidMount() {
    // getting app header from app config
    document.title = this.appConfig.header.title;

    this.getAllBooks((categorizedItems, categoryCount) => {
      // remove the js-loading class so all animations start
      this.setState(
        {
          categorizedItems: categorizedItems,
          categoryCount: categoryCount,
          isAppReady: true
        },
        () =>
          (document.body.className = document.body.className.replace(
            "js-loading",
            ""
          ))
      );
    });
  }

  getAllBooks(callback) {
    let categorizedItems = {};
    let categoryCount = {};

    BooksAPI.getAll().then(items => {
      items.forEach(item => {
        if (!categorizedItems[item.shelf]) categorizedItems[item.shelf] = [];
        categorizedItems[item.shelf].push(item);
      });

      this.categoryValues.forEach(category => {
        if (!categorizedItems[category.id]) categorizedItems[category.id] = [];
      });

      Object.keys(categorizedItems).forEach(
        key => (categoryCount[key] = categorizedItems[key].length)
      );
      callback(categorizedItems, categoryCount);
    });
  }

  onTabChange(tab) {
    this.setState({ selectedTab: tab });
  }

  onShowMoreInfo(itemID) {
    this.setState({ isModalVisible: true, itemOnModalID: itemID });
  }

  onHideMoreInfo(itemID) {
    this.setState({ isModalVisible: false });
  }

  onSearch(query) {
    if (!query) {
      this.setState({ queriedItems: [] });
      return;
    }

    this.setState({ isProcessing: true });
    BooksAPI.search(query).then(response => {
      if (response) {
        if (!response.error) {
          this.setState({ queriedItems: response }, () =>
            this.setState({ isProcessing: false })
          );
        } else this.setState({ isProcessing: false });
      }
    });
  }

  getModalItem() {
    return this.state.selectedTab === "search"
      ? this.state.queriedItems.find(
          item => item.id === this.state.itemOnModalID
        )
      : this.state.categorizedItems[this.state.selectedTab].find(
          item => item.id === this.state.itemOnModalID
        );
  }

  onItemAction(item, moveTo, moveFrom) {
    this.setState({ isProcessing: true });
    BooksAPI.update(item, moveTo).then(response => {
      this.setState(
        prevState => {
          let newCategorizedItems = prevState.categorizedItems;
          let newCategoryCount = prevState.categoryCount;

          // add item locally
          if (moveTo !== "none") {
            newCategorizedItems[moveTo].push(item);
            newCategoryCount[moveTo] = newCategorizedItems[moveTo].length;
          }

          // remove item locally
          if (!["none", "search"].includes(moveFrom)) {
            newCategorizedItems[moveFrom] = newCategorizedItems[
              moveFrom
            ].filter(prevItem => prevItem.id !== item.id);
            newCategoryCount[moveFrom] = newCategorizedItems[moveFrom].length;
          }

          return {
            categorizedItems: newCategorizedItems,
            categoryCount: newCategoryCount,
            updatedCategory: moveTo
          };
        },
        () => this.setState({ isProcessing: false })
      );
    });
  }

  render() {
    const self = this;

    // Dynamic classes:
    // app show class
    const showClass = self.state.isAppReady ? " is-visible" : "";

    return (
      <div role="application" className={`my-application${showClass}`}>
        {self.state.categorizedItems && self.state.categoryCount ? (
          <Header
            config={this.appConfig.header}
            menuCounts={self.state.categoryCount}
            onTabChange={self.onTabChange}
            updatedCategory={self.state.updatedCategory}
          />
        ) : (
          ""
        )}
        <main>
          {Object.keys(self.state.categorizedItems).map(category => (
            <CategoryList
              key={category}
              items={self.state.categorizedItems[category]}
              category={category}
              categoryValues={this.categoryValues}
              onItemAction={self.onItemAction}
              isVisible={category === self.state.selectedTab}
              onShowMoreInfo={self.onShowMoreInfo}
              isProcessing={self.state.isProcessing}
            />
          ))}
          <CategoryList
            key="search"
            isSearch={true}
            items={self.state.queriedItems}
            category="search"
            categoryValues={this.categoryValues}
            onItemAction={self.onItemAction}
            isVisible={"search" === self.state.selectedTab}
            onShowMoreInfo={self.onShowMoreInfo}
            onSearch={self.onSearch}
            isProcessing={self.state.isProcessing}
          />
        </main>
        <Footer config={this.appConfig.footer} />
        {self.state.itemOnModalID &&
          self.state.isModalVisible && (
            <Modal
              item={self.getModalItem()}
              isVisible={self.state.isModalVisible}
              onHidden={self.onHideMoreInfo}
            />
          )}
      </div>
    );
  }
}

export default App;
