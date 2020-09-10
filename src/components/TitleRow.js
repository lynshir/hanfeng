// 框架
import React, { Component } from 'react';

import './index.scss';

function PageTitle({ title, desc }) {
  return (
    <div className="pageTitWrap">
      <div className="pageTit">{title}</div>
      <div className="pageTitDes">{desc}</div>
    </div>
  );
}

function CardTitle({ title, ...rest }) {
  return (
    <div className="cardTit mt20 mb20" {...rest}>
      {title}
    </div>
  );
}

function StepTitle({ step, title, extra }) {
  console.log(extra, 'extraextra');
  return (
    <div className="stepTit">
      <span className="stepNum">{step}</span>
      {title}
      {extra}
    </div>
  );
}
export { PageTitle, CardTitle, StepTitle };
