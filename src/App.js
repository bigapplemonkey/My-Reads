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
      selectedTab: this.appConfig.header.menuOptions[0].id,
      itemOnModalID: "",
      isModalVisible: false,
      updatedCategory: ""
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onShowMoreInfo = this.onShowMoreInfo.bind(this);
    this.onHideMoreInfo = this.onHideMoreInfo.bind(this);
    this.onItemAction = this.onItemAction.bind(this);
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
    // this.setState({
    //   loading:true
    // })
    let categorizedItems = {};
    let categoryCount = {};

    BooksAPI.getAll().then(items => {
      items.forEach(item => {
        if (!categorizedItems[item.shelf]) categorizedItems[item.shelf] = [];
        categorizedItems[item.shelf].push(item);
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

  getModalItem() {
    let allItems = [];
    Object.keys(this.state.categorizedItems).map(
      key => (allItems = allItems.concat(this.state.categorizedItems[key]))
    );

    return allItems.find(item => item.id === this.state.itemOnModalID);
  }

  onItemAction(action) {
    BooksAPI.update({ id: action.itemID }, action.id).then(response => {
      this.getAllBooks((categorizedItems, categoryCount) => {
        this.setState({
          categorizedItems: categorizedItems,
          categoryCount: categoryCount,
          updatedCategory: action.id
        });
      });
    });
  }

  render() {
    const self = this;
    let categoryValues = self.appConfig.header.menuOptions.filter(
      category => category.id !== "search"
    );
    return (
      <div
        role="application"
        className={`my-application ${
          self.state.isAppReady ? "is-visible" : ""
        }`}
      >
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
              categoryValues={categoryValues}
              onItemAction={self.onItemAction}
              isVisible={category === self.state.selectedTab}
              onShowMoreInfo={self.onShowMoreInfo}
            />
          ))}
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
