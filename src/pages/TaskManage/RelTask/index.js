// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Radio, Cascader, Button, Steps } from 'antd';
import { toJS } from 'mobx';
import { PageTitle, CardTitle } from '@comp/TitleRow';

import '../index.scss';
import Store from './store';

import BaseConfig from './BaseConfig';
import TaskConfig from './TaskConfig/TaskConfig';
import ConfirmPay from './ConfirmPay';

const { Step } = Steps;

let store = null;

@observer
class RelTask extends Component {
  constructor(props) {
    super(props);
    if (!store) store = new Store();
  }

  componentDidMount() {
    // store.getCategory();
    store.getPrice();
  }

  render() {
    const { curStep } = store;
    return (
      <div className="container">
        <PageTitle
          title="创建任务"
          desc="您可以开始创建您的任务，任务确认后将被发布至网上，同时冻结相应费用。"
        />
        <div>
          <Steps className="stepWrap" current={curStep}>
            <Step title="基础配置" />
            <Step title="任务配置" />
            <Step title="确认付款" />
          </Steps>
        </div>
        {curStep === 0 && <BaseConfig store={store} />}
        {curStep === 1 && <TaskConfig store={store} />}
        {curStep === 2 && <ConfirmPay store={store} />}
      </div>
    );
  }
}
export default RelTask;
