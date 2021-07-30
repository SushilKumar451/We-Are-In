import React from 'react';
import { Link } from 'react-router-dom';

function Anchor(props) {
  const {
    type,
    linkTo,
    classes,
    onClickCallback,
    content,
    ...restProps
  } = props;

  return type === 'routerLink' ? (
    <Link to={linkTo}>
      <span
        className={classes}
        onClick={onClickCallback ? onClickCallback : () => {}}
        {...restProps}
      >
        {content}
      </span>
    </Link>
  ) : (
    <a
      href={linkTo}
      className={classes}
      onClick={onClickCallback ? onClickCallback : () => {}}
      {...restProps}
    >
      {content}
    </a>
  );
}

export default Anchor;
