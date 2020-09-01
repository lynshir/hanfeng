// 框架
import React, { Component, useState } from 'react';
import { observer } from 'mobx-react';
import { Tabs, Radio, Button, Space, Table } from 'antd';
import { toJS } from 'mobx';

import './index.scss';
import Store from './store';

const { TabPane } = Tabs;
let store = null;

const UserInfo = observer(function UserInfo() {
  return (
    <div className="pannel flex">
      <div className="userInfo">
        <div className="flex infoRow f24">
          <Space>
            <span>头像</span>
            <span>小七旗舰店</span>
            <span>ID</span>
            <span>user</span>
          </Space>
        </div>
        <div className="flex totalWrap">
          <div className="flexc grow1">
            <span>可用余额</span>
            <span className="f20">1212</span>
          </div>
          <div className="flexc grow1">
            <span>冻结资金</span>
            <span className="f20">0</span>
          </div>
          <div className="flexc grow1">
            <span>店铺数量</span>
            <span className="f20">234234</span>
          </div>
          <div className="flexc grow1">
            <span>订单总数</span>
            <span className="f20">234234</span>
          </div>
        </div>
      </div>
      <div className="wxWrap flexc">售后客服微信</div>
    </div>
  );
});

const Notifiy = observer(function Notifiy() {
  return (
    <div className="pannel flexc">
      <div className="f18 f600">系统公告</div>
      {[1, 2, 3].map((v) => {
        return (
          <div className="flex notiWrap f18">
            <div>
              <span className="circle"></span>
              <span>商家请加官方客服微信账号：xxxxxx</span>
            </div>
            <span>2020-02-20 12:12</span>
          </div>
        );
      })}
    </div>
  );
});

//待审核任务
const Review = observer(function Review() {
  return (
    <div className="pannel flexc">
      <div className="f18 f600">待审核任务</div>
      <div>
        代审核订单共<span className="redTxt">0</span>
        单，非下单任务超过48小时未审核将自动通过，请尽快审核。
      </div>
    </div>
  );
});

//任务价格表
const PriceTable = observer(function PriceTable({ store: { columns, dataSource } }) {
  const [viewType, changeView] = useState('pay');
  return (
    <div className="pannel flexc">
      <div className="f18 f600">任务价格表</div>
      <Tabs defaultActiveKey="1" onChange={() => {}}>
        <TabPane tab="淘宝" key="1">
          <Radio.Group
            className="mt30"
            value={viewType}
            onChange={(e) => {
              changeView(e.target.value);
            }}
          >
            <Radio.Button value="pay">下单付款</Radio.Button>
            <Radio.Button value="view">浏览</Radio.Button>
          </Radio.Group>
          <Table columns={columns} dataSource={dataSource} />
        </TabPane>
      </Tabs>
    </div>
  );
});

@observer
class RelTask extends Component {
  constructor(props) {
    super(props);
    if (!store) store = new Store();
  }

  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const { columns, dataSource } = store;
    return (
      <div className="container">
        <UserInfo store={store} />
        <Notifiy store={store} />
        <Review store={store} />
        <PriceTable store={store} />
      </div>
    );
  }
}
export default RelTask;
