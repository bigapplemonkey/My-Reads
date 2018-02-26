// React packages
import React from 'react';
import PropTypes from 'prop-types';

const Footer = props => {
  const config = props.config;

  return (
    <footer className="footer">
      <div className="container">
        <div className="content has-text-centered">
          <p>
            {`${config.projectName} by `}
            <a href={config.authorLink}>{config.authorName}</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  config: PropTypes.object.isRequired
};

export default Footer;
