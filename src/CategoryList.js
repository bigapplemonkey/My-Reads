import React, { Component } from 'react';
import Card from './Card'
import DropDown from './DropDown'

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'All'
    };
    this.onSelect =  this.onSelect.bind(this);
    this.onShowMoreInfo = this.onShowMoreInfo.bind(this);
  }
  // state = {
  //   selectTab: this.props.config.menuOptions[0]
  // }

  // selectTab(selectTab, event) {
  //   event.preventDefault();
  //   if(selectTab !== this.state.selectTab) {
  //    this.setState({ selectTab });
  //    this.props.config.onTabChange(selectTab);
  //   }
  // }

  onSelect(category) {
    console.log('optionSelected', category);
    this.setState({category});
  }

  onShowMoreInfo(itemID) {
    console.log(itemID);
    this.props.onShowMoreInfo(itemID);
  }

  render() {
    const self = this;
    let categories = new Set([]);
    categories.add('All');
    self.props.items.forEach(item => {
      if(item.categories) item.categories.forEach(category => categories.add(category));
      else categories.add('No Category');
    });

    let items = self.props.items;

    if(self.state.category !== 'All') items = items.filter(item => {
      if(item.categories) return item.categories.includes(self.state.category);
      return self.state.category === 'No Category';
    });

    return(
      <section className={`container my-cards-container ${self.props.isVisible ? '' : 'is-hidden'}`}>
        <div className="dropdown-container">
          <DropDown options={categories}
          onSelect={this.onSelect}/>
          </div>
        <ul className="my-cards-grid is-multiline is-vcentered">
          {items.map(item =>
            <Card key={item.id} item={item} onShowMoreInfo={self.onShowMoreInfo}/>
          )}
        </ul>
      </section>
    );
  }
}

export default CategoryList;