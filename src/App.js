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
      updatedTab: "",
      isIncreaseUpdate: false,
      query: "",
      itemIsProcessing: false,
      searchIsProcessing: false
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

  processedResponse(response) {
    let allItems = [];

    this.categoryValues.forEach(
      category =>
        (allItems = allItems.concat(this.state.categorizedItems[category.id]))
    );
    return response.map(responseItem => {
      const shelfItem = allItems.filter(
        shelfItem => shelfItem.id === responseItem.id
      );
      shelfItem.length > 0
        ? (responseItem.shelf = shelfItem[0].shelf)
        : (responseItem.shelf = "none");
      return responseItem;
    });
  }

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
    this.setState({ searchIsProcessing: true }, () => {
      if (!query || query.length === 0) {
        this.setState({ queriedItems: [], searchIsProcessing: false });
      } else {
        BooksAPI.search(query).then(response => {
          if (response) {
            if (!response.error) {
              this.setState(
                { queriedItems: this.processedResponse(response) },
                () => this.setState({ searchIsProcessing: false })
              );
            } else {
              console.log("error", response.error);
              this.setState({ queriedItems: [], searchIsProcessing: false });
            }
          }
        });
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

  onItemAction(item, moveTo) {
    const moveFrom = item.shelf;

    this.setState({ itemIsProcessing: true });
    BooksAPI.update(item, moveTo).then(response => {
      this.getAllBooks((categorizedItems, categoryCount) => {
        const isIncreaseUpdate = moveTo !== "none";
        const updatedTab = moveTo !== "none" ? moveTo : moveFrom;

        this.setState(
          {
            categorizedItems: categorizedItems,
            categoryCount: categoryCount,
            updatedTab: updatedTab,
            queriedItems: this.state.queriedItems.map(queryItem => {
              if (queryItem.id === item.id) queryItem.shelf = moveTo;
              return queryItem;
            }),
            isIncreaseUpdate: isIncreaseUpdate
          },
          () => this.setState({ itemIsProcessing: false })
        );
      });
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
            config={self.appConfig.header}
            menuCounts={self.state.categoryCount}
            onTabChange={self.onTabChange}
            updatedTab={self.state.updatedTab}
            isIncreaseUpdate={self.state.isIncreaseUpdate}
            isProcessing={self.state.itemIsProcessing}
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
              categoryValues={self.categoryValues}
              onItemAction={self.onItemAction}
              isVisible={category === self.state.selectedTab}
              onShowMoreInfo={self.onShowMoreInfo}
              isProcessing={self.state.itemIsProcessing}
            />
          ))}
          <CategoryList
            key="search"
            isSearch={true}
            items={self.state.queriedItems}
            category="search"
            categoryValues={self.categoryValues}
            onItemAction={self.onItemAction}
            isVisible={"search" === self.state.selectedTab}
            onShowMoreInfo={self.onShowMoreInfo}
            onSearch={self.onSearch}
            isProcessing={
              self.state.searchIsProcessing || self.state.itemIsProcessing
            }
          />
        </main>
        <Footer config={self.appConfig.footer} />
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
