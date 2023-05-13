import React, { useState } from "react";
import PropTypes from "prop-types";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion">
      <button className="accordion__button" onClick={handleClick}>
        {title}
      </button>
      {isOpen && <div className="accordion__content">{children}</div>}
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Accordion;
