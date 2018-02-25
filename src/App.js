// React packages
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// Book API
import * as BooksAPI from './BooksAPI';
// Components
import Header from './Header';
import Footer from './Footer';
import CategoryList from './CategoryList';
import Modal from './Modal';
// Styling
import './App.css';
import './Custom.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAppReady: false,
      categorizedItems: {},
      categoryCount: {},
      queriedItems: [],
      selectedTab: '',
      itemOnModal: {},
      isModalVisible: false,
      updatedTab: '',
      isIncreaseUpdate: false,
      itemIsProcessing: false,
      searchIsProcessing: false
    };

    this.onCategoryListDisplay = this.onCategoryListDisplay.bind(this);
    this.onShowMoreInfo = this.onShowMoreInfo.bind(this);
    this.onHideMoreInfo = this.onHideMoreInfo.bind(this);
    this.onItemAction = this.onItemAction.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  // app config map
  appConfig = {
    header: {
      title: 'My Reads',
      subTitle: 'A Book Tracking App',
      menuOptions: [
        { value: 'Currently Reading', id: 'currentlyReading' },
        { value: 'Want to Read', id: 'wantToRead' },
        { value: 'Read', id: 'read' },
        { value: 'Search', id: 'search' }
      ]
    },
    footer: {
      projectName: 'My Reads',
      authorName: 'Jorge Asuaje',
      authorLink: 'https://bigapplemonkey.github.io'
    }
  };

  // caching the categories present
  categoryValues = this.appConfig.header.menuOptions.filter(
    category => category.id !== 'search'
  );

  // when app mounts
  componentDidMount() {
    this.getAllBooks((categorizedItems, categoryCount) => {
      // set initial items and remove the js-loading class so all animations start
      this.setState(
        {
          categorizedItems: categorizedItems,
          categoryCount: categoryCount,
          isAppReady: true
        },
        () =>
          (document.body.className = document.body.className.replace(
            'js-loading',
            ''
          ))
      );
    });
  }

  // get all books when app loads or when an actions happens
  getAllBooks(callback) {
    let categorizedItems = {};
    let categoryCount = {};

    BooksAPI.getAll().then(items => {
      // categorize items
      items.forEach(item => {
        if (!categorizedItems[item.shelf]) categorizedItems[item.shelf] = [];
        categorizedItems[item.shelf].push(item);
      });

      // add empty array for any empty shelf
      this.categoryValues.forEach(category => {
        if (!categorizedItems[category.id]) categorizedItems[category.id] = [];
      });

      // get item count for evey shelf
      Object.keys(categorizedItems).forEach(
        key => (categoryCount[key] = categorizedItems[key].length)
      );
      // when done getting items
      callback(categorizedItems, categoryCount);
    });
  }

  // searh
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
              console.log('error', response.error);
              this.setState({ queriedItems: [], searchIsProcessing: false });
            }
          }
        });
      }
    });
  }

  // check if the search items are already in shelves
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
        : (responseItem.shelf = 'none');
      return responseItem;
    });
  }

  // handle action on item: add, move shelves or remove
  onItemAction(item, moveTo) {
    const moveFrom = item.shelf;

    this.setState({ itemIsProcessing: true });
    BooksAPI.update(item, moveTo).then(response => {
      this.getAllBooks((categorizedItems, categoryCount) => {
        const isIncreaseUpdate = moveTo !== 'none';
        const updatedTab = moveTo !== 'none' ? moveTo : moveFrom;

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

  // get notification from CategoryList component to update selected tab in header
  onCategoryListDisplay(category) {
    this.setState({ selectedTab: category });
  }

  // trigger modal for item
  onShowMoreInfo(item) {
    this.setState({ isModalVisible: true, itemOnModal: item });
  }

  // handle notification from modal when closed
  onHideMoreInfo(item) {
    this.setState({ isModalVisible: false });
  }

  render() {
    const self = this;

    // Dynamic classes:
    // app show class
    const showClass = self.state.isAppReady ? ' is-visible' : '';

    return (
      <div role="application" className={`my-application${showClass}`}>
        <Header
          config={self.appConfig.header}
          menuCounts={self.state.categoryCount}
          selectedTab={self.state.selectedTab}
          updatedTab={self.state.updatedTab}
          isIncreaseUpdate={self.state.isIncreaseUpdate}
          isProcessing={self.state.itemIsProcessing}
        />
        <main>
          {self.appConfig.header.menuOptions.map((category, index) => (
            <Route
              path={
                index === 0
                  ? `${process.env.PUBLIC_URL}/(|${category.id})`
                  : `${process.env.PUBLIC_URL}/${category.id}`
              }
              key={category.id}
              render={() => (
                <CategoryList
                  key={category.id}
                  pageTitle={category.value}
                  onDisplay={self.onCategoryListDisplay}
                  items={
                    category.id !== "search"
                      ? self.state.categorizedItems[category.id]
                      : self.state.queriedItems
                  }
                  category={category.id}
                  categoryValues={self.categoryValues}
                  onItemAction={self.onItemAction}
                  onShowMoreInfo={self.onShowMoreInfo}
                  isSearch={category.id === "search"}
                  onSearch={self.onSearch}
                  isProcessing={
                    self.state.searchIsProcessing || self.state.itemIsProcessing
                  }
                />
              )}
            />
          ))}
        </main>
        <Footer config={self.appConfig.footer} />
        <Modal
          item={self.state.itemOnModal}
          isVisible={self.state.isModalVisible}
          onHidden={self.onHideMoreInfo}
        />
      </div>
    );
  }
}

export default App;
