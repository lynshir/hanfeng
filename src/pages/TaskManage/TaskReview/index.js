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
import TaskListStore from './store';
const store = new TaskListStore();

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
class Filter extends Component {
  componentDidMount() {}

  selectItem = (dic, name, label) => {
    return (
      <Col>
        <Form.Item name={name} label={label}>
          <Select style={{ minWidth: 120 }} placeholder="请选择">
            {dic?.length &&
              dic.map(({ code, name }) => {
                return (
                  <Option value={code} key={code}>
                    {name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
      </Col>
    );
  };

  inputItem = (name, label, placeholder) => {
    return (
      <Col>
        <Form.Item name={name} label={label}>
          <Input placeholder={placeholder || '请输入'} />
        </Form.Item>
      </Col>
    );
  };
  timeItem = (name, label, placeholder) => {
    return (
      <Col>
        <Form.Item name={name} label={label}>
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
      </Col>
    );
  };

  areaItem = (minName, maxName, label, minPlaceholder, maxPlaceholder) => {
    return (
      <Col>
        {/* 数字赋值类型number */}
        <Form.Item label={label}>
          <Form.Item className="priceRange rowItem w500" name={minName} noStyle>
            <InputNumber min={0} placeholder={'最小金额' || minPlaceholder} />
          </Form.Item>
          <span className="ml10 mr10">-</span>
          <Form.Item colon={false} label=" " name={maxName} noStyle>
            <InputNumber min={0} placeholder={'最大金额' || maxPlaceholder} />
          </Form.Item>
        </Form.Item>
      </Col>
    );
  };

  render() {
    const {
      setTaskReviewRef,
      plaformDic,
      shopDic,
      statusDic,
      taskTypeDic,
      completeDic,
      onSearch,
    } = store;
    return (
      <Form initialValues={{}} {...formItemLayout} ref={setTaskReviewRef}>
        <Row gutter={24}>
          {this.inputItem('platAccout', '平台账号', '请输入接单平台账号')}
          {this.timeItem('orderTime', '接单时间')}
          {this.timeItem('startTime', '任务开始时间')}
          {this.timeItem('submitTime', '用户提交时间')}
          {this.timeItem('reviewTime', '任务审核时间')}
          {this.selectItem(plaformDic, 'platform', '平台')}
          {this.selectItem(shopDic, 'shop', '店铺名称')}
          {this.selectItem(taskTypeDic, 'taskType', '任务类型')}
          {this.inputItem('orderNo', '订单编号', '请输入订单编号')}
          {this.inputItem('taskNo', '任务编号', '请输入任务编号')}
          {this.inputItem('productId', '商品ID', '请输入商品ID')}
          {this.selectItem(completeDic, 'complete', '完成情况')}
          {this.areaItem('totalMin', 'totalMax', '商品总价')}
          {this.areaItem('payMin', 'payMax', '实付金额')}
          <Col style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={onSearch}>
              搜索
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

@observer
class TaskReview extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const { dataSource, getColunms } = store;
    return (
      <div className="container">
        <PageTitle
          title="任务审核列表"
          desc="此处可以审核买手已完成的任务，非下单任务24分钟内不审核将自动通过，下单任务需人工审核"
        />
        <div className="pannel">
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header="筛选器" key="1">
              <Filter />
            </Panel>
          </Collapse>
        </div>
        <Row className="pannel taskNumInfo" align="middle" justify="space-between">
          <Col className="flexc">
            <span className="title cl9e f14 f500">待操作</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">待审核</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">已拒绝</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">已完成</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
        </Row>
        <CardTitle title="审核列表" />
        <Tabs defaultActiveKey="1" onChange={() => {}}>
          <TabPane tab="待操作" key="1"></TabPane>
          <TabPane tab="待审核" key="2"></TabPane>
          <TabPane tab="已完成" key="3"></TabPane>
          <TabPane tab="已拒绝" key="4"></TabPane>
        </Tabs>
        <Row className="mb20" justify="end">
          <Space size="middle">
            <Button>批量审核</Button>
            <Button>导出</Button>
            <Button>对账导出</Button>
          </Space>
        </Row>
        <Table dataSource={dataSource} columns={getColunms()} size="middle" scroll={{ x: 1300 }} />;
      </div>
    );
  }
}
export default TaskReview;
