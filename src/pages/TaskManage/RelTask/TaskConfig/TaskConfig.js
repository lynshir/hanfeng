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
  Divider,
  Cascader,
} from 'antd';
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

let a = {
  address: '上海',
  itemId: '624599325289', //商品id
  payNum: '3',
  pic: '//img.alicdn.com/imgextra/i1/2207293755222/O1CN01N3bwTT1oRis8vLzgv_!!0-item_pic.jpg',
  price: '3599',
  sellerNick: 'bape官方旗舰店', //掌柜昵称
  shopName: 'BAPE官方旗舰店', //店铺昵称
  title: 'BAPE男装秋冬鲨鱼WGM字母图案数码迷彩连帽拉链长袖卫衣115005F', //商品标题
};
@observer
class Product extends Component {
  render() {
    const {
      productList,
      // productSaveList,
      onDeleteProduct,
      onFormItemChange,
      getProductInfo,
    } = this.props.store;
    // const { itemId, pic, sellerNick, shopName, title } = a;
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
            itemUrl,
            num,
            price,
            address,
            payNum,
            priceRange,
            minPrice,
            maxPrice,
            itemId,
            pic,
            sellerNick,
            shopName,
            title,
          } = v;
          return (
            <Form
              {...formItemLayout}
              name={'商品' + (i + 1)}
              className="productList"
              initialValues={{
                nameOrder,
                itemUrl,
                num,
                price,
                address,
                payNum,
                priceRange,
                minPrice,
                maxPrice,
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
                  name="itemUrl"
                  rules={[{ required: true, message: '请输入商品链接!' }]}
                  noStyle
                >
                  <Input placeholder="请输入商品链接" />
                </Form.Item>
                <Button type="primary" onClick={getProductInfo.bind(this, i)}>
                  获取商品链接
                </Button>
              </Form.Item>
              {itemId && (
                <div className="pannel proLinkPannel">
                  <div>
                    <img alt="img" src={`https:${pic}`} className="wh100" />
                  </div>
                  <div className="f16 proLinkInfo">
                    <div>{title}</div>
                    <div>商品ID：{itemId}</div>
                    <div>店铺名称：{sellerNick}</div>
                    <div>掌柜昵称：{shopName}</div>
                  </div>
                </div>
              )}
              <Form.Item label={<span className="mustTit">拍下件数</span>}>
                <Form.Item
                  name="num"
                  rules={[{ required: true, message: '请输入拍下件数!' }]}
                  noStyle
                >
                  <InputNumber min={0} />
                </Form.Item>
                <span className="ml10">件</span>
              </Form.Item>
              <Form.Item label={<span className="mustTit">商品单价</span>}>
                <Form.Item
                  name="price"
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
                <Form.Item className="priceRange rowItem w500" name="minPrice" noStyle>
                  <InputNumber min={0} placeholder="请输入" />
                </Form.Item>
                <span className="ml10 mr10">-</span>
                <Form.Item colon={false} label=" " name="maxPrice" noStyle>
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
    const {
      store: { getCategory },
    } = this.props;
    getCategory();
  }

  render() {
    const {
      store,
      store: {
        nextStep,
        prevStep,
        onAddProduct,
        proCategory,
        onInputChange,
        proItemOptions,
        proItemChange,
      },
    } = this.props;
    return (
      <div className="baseConfig">
        <CardTitle title="任务信息" />
        <div className="mt20 mb20">
          <Row align="middle" className="w300">
            <Col span={8}>任务名称</Col>
            <Col span={16}>
              <Input placeholder="请输入任务名称" onChange={onInputChange.bind(this, 'taskName')} />
            </Col>
          </Row>
          <Row align="middle" className="w300 mt20">
            <Col span={8}>商品类目</Col>
            <Col span={16}>
              <Radio.Group
                defaultValue="a"
                buttonStyle="solid"
                value={proCategory}
                onChange={onInputChange.bind(this, 'proCategory')}
              >
                <Radio.Button value="a" className="w100">
                  选择分类
                </Radio.Button>
                <Radio.Button value="b" className="w100 tc">
                  不限
                </Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          {proCategory === 'a' ? (
            <Row align="middle" className="w300 mt10">
              <Col span={8}></Col>
              <Col span={16}>
                <Cascader
                  style={{ width: 300 }}
                  options={proItemOptions}
                  onChange={proItemChange}
                  showSearch={(inputValue, path) => {
                    return path.some(
                      (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
                    );
                  }}
                  placeholder="请选择或搜索类目"
                />
              </Col>
            </Row>
          ) : null}
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
