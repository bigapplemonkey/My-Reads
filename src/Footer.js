import React from "react";

const Footer = props => {
  const config = props.config;

  return (
    <footer className="footer">
      <div className="container">
        <div className="content has-text-centered">
          <p>
            {config.projectName} by{" "}
            <a href={config.authorLink}>{config.authorName}</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
