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
import CommentTaskStore from './store';
const store = new CommentTaskStore();

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
          {this.inputItem('orderNo', '工单编号', '请输入工单编号')}
          {this.selectItem(shopDic, 'shop', '状态')}
          {this.selectItem(plaformDic, 'platform', '类型')}
          {this.inputItem('yewudanhao', '关联业务单号', '请输入关联业务单号')}
          {this.timeItem('orderTime', '提交时间')}
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
class CommentTask extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const { dataSource, getColunms } = store;
    return (
      <div className="container">
        <PageTitle title="评论任务审核列表" />
        <div className="pannel">
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header="筛选器" key="1">
              <Filter />
            </Panel>
          </Collapse>
        </div>
        <Row className="mb20" justify="end">
          <Space size="middle">
            <Button>导出</Button>
          </Space>
        </Row>
        <Table dataSource={dataSource} columns={getColunms()} size="middle" />;
      </div>
    );
  }
}
export default CommentTask;
