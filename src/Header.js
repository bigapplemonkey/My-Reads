import React, { Component } from 'react';

class Header extends Component {

  state = {
    selectTab: this.props.config.menuOptions[0].id
  }

  selectTab(selectTab, event) {
    event.preventDefault();
    if(selectTab !== this.state.selectTab) {
     this.setState({ selectTab });
     this.props.onTabChange(selectTab);
    }
  }

  render() {
    const self = this;
    const config = self.props.config;

    return(
      <header className="hero is-warning">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column">
                <h1 className="title">
                  {config.title}
                </h1>
                <h2 className="subtitle">
                  {config.subTitle}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-foot">
          <nav className="tabs is-boxed">
            <div className="container">
              <ul>
                {config.menuOptions.map((option) => {
                  return(
                    <li key={option.id} className={self.state.selectTab === option.id ? 'is-active' : ''}>
                      <a onClick={(event) => self.selectTab(option.id, event)}>
                        {option.id.includes('search') && <span className="icon is-small"><i className="fas fa-search-plus"></i></span>}
                        <h2>{option.title}</h2>
                        {!option.id.includes('search') && <span class="item-count tag is-white is-rounded">7</span>}
                      </a>
                    </li>
                    );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;