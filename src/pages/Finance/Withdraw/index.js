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
import WithDrawStore from './store';
const store = new WithDrawStore();

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
        <PageTitle title="提现及记录" desc="提现需经过平台审核后，才能提交" />
        <CardTitle title="提现" />
        <Row justify="space-between" className="mt20 mb20">
          <Col span={12}>
            <div className="f16 flexc redTxt">
              <div>提现说明：</div>
              <div>1、提现需全额提现，不可部分提现。</div>
              <div>
                2、提现只能退还至充值时充值的银行卡中,如分多张银行卡充值,则到账多张银行卡,请您确保银行卡运作正常，如有疑问请联系管理员。
              </div>
            </div>
            <Row className="mb10" justify="start" align="middle">
              <Col className="f500 f16"> 提现金额：</Col>
              <Col>
                <Input placeholder="请输入"></Input>
              </Col>
            </Row>
            <Row>
              <Button type="primary">申请提现</Button>
            </Row>
          </Col>
        </Row>
        <CardTitle title="提现记录" />
        <Table dataSource={dataSource} columns={getColunms()} size="middle" />;
      </div>
    );
  }
}
export default Recharge;
