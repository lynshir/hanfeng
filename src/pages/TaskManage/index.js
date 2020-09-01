import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import RelTask from './RelTask';
import TaskList from './TaskList';

function TaskManage() {
  return (
    <>
      <Route path="/member-center/relTask" component={RelTask} />
      <Route path="/member-center/taskList" component={TaskList} />
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

export default TaskManage;
