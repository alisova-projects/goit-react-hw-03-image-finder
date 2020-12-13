import React from 'react';
import PropTypes from 'prop-types';

function onBtnClick({ onClick }) {
  return (
    <button type="button" className="Button" onClick={onClick}>
      Load more
    </button>
  );
}
onBtnClick.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default onBtnClick;
