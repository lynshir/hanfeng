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
  Modal,
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
import ShopStore from './store';
const store = new ShopStore();

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const { TabPane } = Tabs;

@observer
class Shop extends Component {
  componentDidMount() {
    store.onSearch();
  }

  render() {
    const {
      dataSource,
      getColunms,
      setShopRef,
      openModal,
      show,
      handleOk,
      handleCancel,
      onTableChange,
      pagination,
    } = store;
    return (
      <div className="container">
        <PageTitle title="店铺管理" desc="管理您的店铺和商户基本信息" />
        <div className="mt20 mb20">
          <Button type="primary" onClick={openModal}>
            添加店铺
          </Button>
        </div>
        <Modal title="添加店铺" visible={show} onOk={handleOk} onCancel={handleCancel}>
          <Form ref={setShopRef} {...layout} initialValues={{ platformType: 1 }}>
            <Form.Item
              label="店铺名称"
              name="shopName"
              rules={[{ required: true, message: '请输入店铺!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="平台"
              name="platformType"
              rules={[{ required: true, message: '请选择店铺!' }]}
            >
              <Select style={{ width: 200 }}>
                <Option value={1}>淘宝</Option>
                <Option value={2}>京东</Option>
                <Option value={3}>平多多</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="店铺链接"
              name="shopUrl"
              rules={[{ required: true, message: '请输入店铺链接!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="店铺平台账号"
              name="platformShopCode"
              rules={[{ required: true, message: '请输入店铺平台账号!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="下单任务间隔数" name="taskSplitDays">
              <Input />
            </Form.Item>
            <Form.Item
              label="联系人"
              name="connectName"
              rules={[{ required: true, message: '请输入联系人!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="connectMobile"
              rules={[{ required: true, message: '请输入联系电话!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="退货地址"
              name="refundAddress"
              rules={[{ required: true, message: '请输入退货地址!' }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>
        <Table
          dataSource={dataSource}
          columns={getColunms()}
          pagination={pagination}
          size="middle"
          onChange={onTableChange}
        />
      </div>
    );
  }
}
export default Shop;
