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
import RechargeStore from './store';
const store = new RechargeStore();

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
class Recharge extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const { dataSource, getColunms } = store;
    return (
      <div className="container">
        <PageTitle
          title="充值及记录"
          desc="请由转账的方式将资金划入账户并提交充值信息，系统将会在1个工作日内进行审核"
        />
        <CardTitle title="充值" />
        <Row justify="space-between" className="mt20 mb20">
          <Col span={8}>
            <Row className="mb10" justify="start" align="middle">
              <Col className="f500 f14"> 转账金额：</Col>
              <Col>
                <Input></Input>
              </Col>
            </Row>
            <Row justify="start" align="middle">
              <Col className="f500 f14"> 转账备注：</Col>
              <Col>
                <Input></Input>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div className="pannel">
              <h3>充值提醒</h3>
              <div>1、农行网银盾黑屏：在网银盾程序中关闭安全模式</div>
              <div>2、工商银行限额：手机APP上调整额度</div>
            </div>
          </Col>
        </Row>
        <CardTitle title="提现记录" />
        <Table dataSource={dataSource} columns={getColunms()} size="middle" />;
      </div>
    );
  }
}
export default Recharge;
