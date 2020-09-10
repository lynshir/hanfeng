import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AccountNo from './AccountNo';
import Shop from './Shop';
import WorkOrder from './WorkOrder';

function FinanceRouter() {
  return (
    <>
      <Route path="/member-center/accountNo" component={AccountNo} />
      <Route path="/member-center/shop" component={Shop} />
      <Route path="/member-center/workOrder" component={WorkOrder} />

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
