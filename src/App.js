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
      categorizedItems: {},
      categoryCount: {},
      selectedTab: this.appConfig.header.menuOptions[0].id,
      itemOnModalID: "",
      isModalVisible: false
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onShowMoreInfo = this.onShowMoreInfo.bind(this);
    this.onHideMoreInfo = this.onHideMoreInfo.bind(this);
  }

  appConfig = {
    header: {
      title: "My Reads",
      subTitle: "Primary subtitle",
      menuOptions: [
        { title: "Currently Reading", id: "currentlyReading" },
        { title: "Want to Read", id: "wantToRead" },
        { title: "Read", id: "read" },
        { title: "Search", id: "search" }
      ]
    },
    footer: {
      projectName: "My Reads",
      authorName: "Jorge Asuaje",
      authorLink: "https://bigapplemonkey.github.io"
    }
  };

  onTabChange(tab) {
    // console.log(this)
    // console.log(tab);
    this.setState({ selectedTab: tab });
  }

  onShowMoreInfo(itemID) {
    this.setState({ isModalVisible: true, itemOnModalID: itemID });
  }

  onHideMoreInfo(itemID) {
    this.setState({ isModalVisible: false });
  }

  componentDidMount() {
    document.title = this.appConfig.header.title;

    const categories = this.appConfig.header.menuOptions.map(menu => menu.id);

    let categorizedItems = {};
    let categoryCount = {};

    categories.forEach(category => (categorizedItems[category] = []));

    this.setState({ categorizedItems });

    BooksAPI.getAll().then(items => {
      //console.log(items);
      let categorizedItems = {};
      items.forEach(item => {
        let category = categories.find(function(category) {
          return category === item.shelf;
        });
        if (!categorizedItems[category]) categorizedItems[category] = [];
        categorizedItems[category].push(item);
      });

      Object.keys(categorizedItems).forEach(
        key => (categoryCount[key] = categorizedItems[key].length)
      );

      this.setState({ categorizedItems, categoryCount });
    });
  }

  getModalItem() {
    let allItems = [];
    Object.values(this.state.categorizedItems).forEach(
      items => (allItems = allItems.concat(items))
    );
    return allItems.find(item => item.id === this.state.itemOnModalID);
  }

  render() {
    const self = this;
    return (
      <div role="application">
        {self.state.categorizedItems && self.state.categoryCount ? (
          <Header
            config={this.appConfig.header}
            menuCounts={self.state.categoryCount}
            onTabChange={self.onTabChange}
          />
        ) : (
          ""
        )}
        <main>
          {Object.keys(self.state.categorizedItems).map(category => (
            <CategoryList
              key={category}
              items={self.state.categorizedItems[category]}
              isVisible={category === self.state.selectedTab}
              onShowMoreInfo={self.onShowMoreInfo}
            />
          ))}
        </main>
        <Footer config={this.appConfig.footer} />
        {self.state.itemOnModalID && (
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
