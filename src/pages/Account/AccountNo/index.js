// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Row,
  Col,
  Select,
  Button,
  Space,
  Input,
  Radio,
  Form,
  InputNumber,
  DatePicker,
  Tabs,
  Table,
  Collapse,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import shortid from 'shortid';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import '../index.scss';
import AccountNoStore from './store';
const store = new AccountNoStore();

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const formItemLayout = {
  // labelCol: {
  //   xs: { span: 24 },
  //   sm: { span: 8 },
  // },
  // wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 },
  // },
};

const { TabPane } = Tabs;

@observer
class AccountNo extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const { dataSource, getColunms } = store;
    return (
      <div className="container">
        <PageTitle title="商家账号" desc="创建、管理商家账号" />
        <div className="mt20 mb20">
          <Button type="primary">添加账号</Button>
        </div>
        <Table dataSource={dataSource} columns={getColunms()} size="middle" />;
      </div>
    );
  }
}
export default AccountNo;
