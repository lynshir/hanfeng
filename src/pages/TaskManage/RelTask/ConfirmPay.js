// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Row,
  Col,
  Select,
  Table,
  Button,
  Space,
  Input,
  Radio,
  Form,
  InputNumber,
  Divider,
  Cascader,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import shortid from 'shortid';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import '../index.scss';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};

const columns = [
  {
    title: '分类',
    dataIndex: 'category',
  },
  {
    title: '费用明细',
    dataIndex: 'detail',
  },
  {
    title: '任务数量',
    dataIndex: 'taskNum',
  },
  {
    title: '小计',
    dataIndex: 'total',
  },
];

const infoColumns = [
  {
    title: '项',
    dataIndex: 'item',
  },
  {
    title: '值',
    dataIndex: 'info',
  },
];

@observer
class ConfirmPay extends Component {
  componentDidMount() {
    const {
      store: { getCategory },
    } = this.props;
  }

  render() {
    const {
      store,
      store: { nextStep, prevStep, feeDetail, confirmTaskInfo, publish },
    } = this.props;
    return (
      <div className="baseConfig confirmPayWrap">
        <CardTitle title="收费明细" />
        <Table
          columns={columns}
          pagination={false}
          dataSource={feeDetail}
          summary={(pageData) => {
            let totalFee = 0;
            pageData.forEach(({ total }) => {
              totalFee += total;
            });
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <span>{totalFee}</span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
        <CardTitle title="任务信息" />
        <Table columns={infoColumns} dataSource={confirmTaskInfo} pagination={false} />
        <div className="pannel cfPan">
          <Row justify="space-between">
            <Col>
              <div className="f18 mb10">
                需支付 <span className="redTxt">11111</span>元
              </div>
              <div className="f12 cl3">您的账户余额为0.00元</div>
              <div className="f14 cl9">请确认支付金额，确认后，将会在您的余额中扣除</div>
            </Col>
            <Col>
              <Space>
                <Button onClick={publish.bind(this, 3)}>保存草稿</Button>
                <Button onClick={prevStep}>返回上一步</Button>
                <Button onClick={publish.bind(this, 0)}>确认支付</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default ConfirmPay;
