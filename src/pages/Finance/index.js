import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Recharge from './Recharge';
import Withdraw from './Withdraw';
import FundingDetail from './FundingDetail';

function FinanceRouter() {
  return (
    <>
      <Route path="/member-center/recharge" component={Recharge} />
      <Route path="/member-center/withdraw" component={Withdraw} />
      <Route path="/member-center/fundingDetail" component={FundingDetail} />

      {/* <Route
        path="/member-center/customSort"
        render={() => (
          <CustomSort>
            <Switch>
              <Route path="/member-center/customSort/setCategory" component={SetCategory} />
              <Route path="/member-center/customSort/productCategory/:categoryId" component={ProductCategory} />
              <Route component={SetCategory} />
            </Switch>
          </CustomSort>
        )}
      /> */}
    </>
  );
}

export default FinanceRouter;
