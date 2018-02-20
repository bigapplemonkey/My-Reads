import React, { Component } from "react";

class Header extends Component {
  state = {
    selectTab: this.props.config.menuOptions[0].id,
    isVisible: false
  };

  selectTab(selectTab, event) {
    event.preventDefault();
    if (selectTab !== this.state.selectTab) {
      this.setState({ selectTab });
      this.props.onTabChange(selectTab);
    }
  }

  componentDidMount() {
    this.setState({isVisible: true});
  }

  render() {
    const self = this;
    const { config, menuCounts } = self.props;

    return (
      <header className={`hero is-warning ${self.state.isVisible ? 'is-visible' : ''}`}>
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column">
                <h1 className="title">{config.title}</h1>
                <h2 className="subtitle">{config.subTitle}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={`hero-foot ${(self.state.isVisible && menuCounts) ? 'is-visible' : ''}`}>
          <nav className="tabs is-boxed">
            <div className="container">
              <ul>
                {config.menuOptions.map(option => {
                  return (
                    <li
                      key={option.id}
                      className={
                        self.state.selectTab === option.id ? "is-active" : ""
                      }
                    >
                      <a onClick={event => self.selectTab(option.id, event)}>
                        {option.id.includes("search") && (
                          <span className="icon is-small">
                            <i className="fas fa-search-plus" />
                          </span>
                        )}
                        <h2>{option.title}</h2>
                        {!option.id.includes("search") &&
                          menuCounts[option.id] && (
                            <span className="item-count tag is-white is-rounded">
                              {menuCounts[option.id]}
                            </span>
                          )}
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
