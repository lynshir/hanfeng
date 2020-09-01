// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Select, Button, Space, Input, Radio, Form, InputNumber, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import shortid from 'shortid';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import TimeRange from './TimeRange';
import TaskReq from './TaskReq';
import TaskStep from './TaskStep';
import '../../index.scss';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};

@observer
class Product extends Component {
  render() {
    const { productList, onDeleteProduct, onFormItemChange } = this.props.store;
    return (
      <Form.Provider
        onFormChange={(name, { changedFields, forms }) => {
          // if (name === 'userForm') {
          //   const { basicForm } = forms;
          //   const users = basicForm.getFieldValue('users') || [];
          //   basicForm.setFieldsValue({
          //     users: [...users, values],
          //   });
          //   setVisible(false);
          // }
          onFormItemChange(name, changedFields, forms);
        }}
      >
        {productList.map((v, i) => {
          const {
            nameOrder,
            link,
            bought,
            unit,
            address,
            payNum,
            priceRange,
            priceMin,
            priceMax,
          } = v;
          return (
            <Form
              {...formItemLayout}
              name={'商品' + (i + 1)}
              className="productList"
              initialValues={{
                nameOrder,
                link,
                bought,
                unit,
                address,
                payNum,
                priceRange,
                priceMin,
                priceMax,
              }}
              key={shortid.generate()}
              // {...layout}
            >
              <div>
                <Row justify="space-between" align="bottom">
                  <div className="mt10 f16 cl3">商品{i + 1}</div>
                  {i !== 0 && (
                    <DeleteOutlined
                      style={{ color: 'red', fontSize: 19, cursor: 'pointer' }}
                      onClick={onDeleteProduct.bind(this, i)}
                    />
                  )}
                </Row>
                <Divider className="formDvd f14" />
              </div>
              <Form.Item label={<span className="mustTit">商品链接</span>} className="rowItem">
                <Form.Item
                  // className="w500"
                  name="link"
                  rules={[{ required: true, message: '请输入商品链接!' }]}
                  noStyle
                >
                  <Input placeholder="请输入商品链接" />
                </Form.Item>
                <Button type="primary">获取商品链接</Button>
              </Form.Item>
              <Form.Item label={<span className="mustTit">拍下件数</span>}>
                <Form.Item
                  name="bought"
                  rules={[{ required: true, message: '请输入拍下件数!' }]}
                  noStyle
                >
                  <InputNumber min={0} />
                </Form.Item>
                <span className="ml10">件</span>
              </Form.Item>
              <Form.Item label={<span className="mustTit">商品单价</span>}>
                <Form.Item
                  name="unit"
                  rules={[{ required: true, message: '请输入商品单价!' }]}
                  noStyle
                >
                  <InputNumber min={0} placeholder="请输入商品单价" />
                </Form.Item>
                <span className="ml10">元</span>
              </Form.Item>
              <Form.Item
                // className="w500"
                label="店铺所在地"
                name="address"
                rules={[{ required: true, message: '请输入店铺所在地!' }]}
              >
                <Input placeholder="例如：浙江杭州" />
              </Form.Item>
              <Form.Item
                // className="w500"
                label="付款人数"
                name="payNum"
                rules={[{ required: true, message: '请输入付款人数!' }]}
              >
                <InputNumber min={0} placeholder="请输入" />
              </Form.Item>
              {/* 数字赋值类型number */}
              <Form.Item label="价格区间">
                <Form.Item className="priceRange rowItem w500" name="priceMin" noStyle>
                  <InputNumber min={0} placeholder="请输入" />
                </Form.Item>
                <span className="ml10 mr10">-</span>
                <Form.Item colon={false} label=" " name="priceMax" noStyle>
                  <InputNumber min={0} placeholder="请输入" />
                </Form.Item>
              </Form.Item>
            </Form>
          );
        })}
      </Form.Provider>
    );
  }
}

@observer
class TaskConfig extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const {
      store,
      store: { nextStep, prevStep, onAddProduct },
    } = this.props;
    return (
      <div className="baseConfig">
        <CardTitle title="任务信息" />
        <div className="mt20 mb20">
          <Row align="middle" className="w300">
            <Col span={8}>任务名称</Col>
            <Col span={16}>
              <Input placeholder="请输入任务名称" />
            </Col>
          </Row>
          <Row align="middle" className="w300 mt20">
            <Col span={8}>商品类目</Col>
            <Col span={16}>
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a" className="w100">
                  选择分类
                </Radio.Button>
                <Radio.Button value="b" className="w100 tc">
                  不限
                </Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row align="middle" className="w300 mt10">
            <Col span={8}></Col>
            <Col span={16}>
              <Input placeholder="请输入任务名称" />
            </Col>
          </Row>
        </div>
        <CardTitle title="商品信息" />
        <Product store={store} />
        <div>
          <Button style={{ width: '100%' }} onClick={onAddProduct}>
            新增一个商品
          </Button>
        </div>
        <TimeRange store={store} />
        <TaskReq store={store} />
        <TaskStep store={store} />
        <div className="mt20 flex" style={{ justifyContent: 'flex-end' }}>
          <Space>
            <Button type="primary" onClick={prevStep}>
              上一步
            </Button>
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
          </Space>
        </div>
      </div>
    );
  }
}
export default TaskConfig;
