// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Select, Button, Space, Input, Radio, Form, InputNumber, DatePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import shortid from 'shortid';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import '../index.scss';
import TaskListStore from './store';
import TaskPannel from './TaskPannel';
const store = new TaskListStore();

const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@observer
class Filter extends Component {
  componentDidMount() {
    store.getShopDic();
  }

  selectItem = (dic, name, label) => {
    return (
      <Col span={8}>
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
      <Col span={8}>
        <Form.Item name={name} label={label}>
          <Input placeholder={placeholder || '请输入'} />
        </Form.Item>
      </Col>
    );
  };

  render() {
    const {
      setTaskStepRef,
      plaformDic,
      shopDic,
      statusDic,
      taskTypeDic,
      completeDic,
      onSearch,
    } = store;
    return (
      <Form initialValues={{}} {...formItemLayout} ref={setTaskStepRef}>
        <Row>
          <Col span={8}>
            <Form.Item name="startTime" label="任务开始时间">
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </Col>
          {this.selectItem(plaformDic, 'platformType', '平台')}
          {this.selectItem(shopDic, 'shopId', '店铺')}
          {this.selectItem(taskTypeDic, 'taskType', '类型')}
          {this.selectItem(statusDic, 'status', '状态')}
          {this.inputItem('itemId', '商品ID', '请输入搜索条件商品ID')}
          {this.inputItem('taskName', '任务名称', '请输入任务名称')}
          {this.inputItem('taskOrderNo', '任务编号', '请输入任务编号')}
          {this.selectItem(completeDic, 'finishStatus', '完成情况')}
          <Col span={8} style={{ textAlign: 'center' }}>
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
class TaskList extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    return (
      <div className="container">
        <PageTitle
          title="任务列表"
          desc="您可以查看您所发布的任务情况，也可以根据您的需要编辑并重新发布"
        />
        <div className="pannel">
          <div className="pannelTit">筛选器</div>
          <Filter />
        </div>
        <Row className="pannel taskNumInfo" align="middle" justify="space-between">
          <Col className="flexc">
            <span className="title cl9e f14 f500">任务总数</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">任务总数</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">任务总数</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">任务总数</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
          <Col className="flexc">
            <span className="title cl9e f14 f500">任务总数</span>
            <span className="numInfo cl3 f18">10</span>
          </Col>
        </Row>
        <TaskPannel store={store} />
      </div>
    );
  }
}
export default TaskList;
