// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Select, Form, Radio, Checkbox } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { toJS, action } from 'mobx';
import shortid from 'shortid';
import { StepTitle, CardTitle } from '@comp/TitleRow';
import UploadOSS from './UploadOSS';
import Editor from './Editor';
import '../../index.scss';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

@observer
class TaskStep extends Component {
  componentDidMount() {
    // store.getCategory();
  }
  state = {
    loading: false,
  };

  handleChange = action((value) => {
    console.log('TaskReq -> handleChange -> value', value);
    const { store } = this.props;
  });

  render() {
    const {
      store,
      store: {
        setTaskStepRef,
        onTaskFormChange,
        taskStep: { collect, extReq, joinCart },
      },
    } = this.props;
    return (
      <div className="taskStep mt20">
        <CardTitle title="任务步骤" />
        <div className="redTxt mt10 mb20">
          连续任务会在用户提交后逐步要求商户审核，商户审核之后用户才能提交下一个步骤
        </div>
        <Form
          initialValues={{
            collect: 1,
            collectReview: 1,
            collectScreenShot: 1,
            extReq: 1,
            extReqScreenShot: 1,
            joinCart: 1,
            confirmOrderScreenShot: 1,
          }}
          {...formItemLayout}
          ref={setTaskStepRef}
          onValuesChange={onTaskFormChange}
        >
          <StepTitle title="收藏商品" step="1"></StepTitle>
          <Form.Item label="是否需要收藏商品" className="flexr">
            <Form.Item name="collect">
              <Radio.Group>
                <Radio value={0}>收藏商品</Radio>
                <Radio value={1}>不收藏商品</Radio>
              </Radio.Group>
            </Form.Item>
            <span className="redTxt mr10">+0元</span>
            选择收藏，则买手在执行该任务时需要收藏商品
          </Form.Item>
          {collect === 0 && (
            <Form.Item label="审核方式" className="flexr">
              <Form.Item name="collectReview">
                <Radio.Group>
                  <Radio value={1}>审核商品</Radio>
                </Radio.Group>
              </Form.Item>
              系统自动审核即用户提交图片后，系统自动通过
            </Form.Item>
          )}

          {collect === 0 && (
            <Form.Item label="截图" className="flexr">
              <Form.Item name="collectScreenShot">
                <Radio.Group>
                  <Radio value={0}>需要截图</Radio>
                  <Radio value={1}>无需截图</Radio>
                </Radio.Group>
              </Form.Item>
              <div>
                选择需要截图，则买手会将图片上传后审核，建议不要大批量的发布需要截图的任务，会触发风控
              </div>
            </Form.Item>
          )}
          {collect === 0 && <div className="explain">收藏商品后立即开启下一步任务</div>}
          <StepTitle title="额外要求" step="2"></StepTitle>
          <Form.Item label="是否需要额外要求" className="flexr">
            <Form.Item name="extReq">
              <Radio.Group>
                <Radio value={0}>额外要求</Radio>
                <Radio value={1}>无额外要求</Radio>
              </Radio.Group>
            </Form.Item>
            <span className="redTxt mr10">+0元</span>
            选择额外要求，需写明额外要求的内容，需要买手截取什么图片等
          </Form.Item>
          {extReq === 0 && (
            <Form.Item label="审核方式" className="flexr">
              <Form.Item name="extReqReview">
                <Radio.Group>
                  <Radio value={1}>审核商品</Radio>
                </Radio.Group>
              </Form.Item>
              用户提交下单需由商户审核，审核请勿拖延时间过长，以免引起用户投诉
            </Form.Item>
          )}

          {extReq === 0 && (
            <Form.Item label="截图" className="flexr">
              <Form.Item name="extReqScreenShot">
                <Radio.Group>
                  <Radio value={0}>需要截图</Radio>
                  <Radio value={1}>无需截图</Radio>
                </Radio.Group>
              </Form.Item>
              <div>
                选择需要截图，则买手会将图片上传后审核，建议不要大批量的发布需要截图的任务，会触发风控
              </div>
            </Form.Item>
          )}
          {extReq === 0 && (
            <Form.Item label="店家要求">
              <Editor store={store} noTitle={true} />
            </Form.Item>
          )}
          {extReq === 0 && <div className="explain">额外要求后立即开启下一步任务</div>}

          <StepTitle
            title="加购物车"
            step="3"
            extra={<span className="redTxt ml10">包含多个商品，必选加购物车</span>}
          ></StepTitle>
          <Form.Item label="是否需要加购物车" className="flexr">
            <Form.Item name="joinCart">
              <Radio.Group>
                <Radio value={0}>加购物车</Radio>
                <Radio value={1}>不加购物车</Radio>
              </Radio.Group>
            </Form.Item>
            <span className="redTxt mr10">+0元</span>
            选择加购，则买手在执行该任务时需要将商品添加购物车
          </Form.Item>
          {joinCart === 0 && (
            <Form.Item label="审核方式" className="flexr">
              <Form.Item name="joinCartReview">
                <Radio.Group>
                  <Radio value={1}>审核商品</Radio>
                </Radio.Group>
              </Form.Item>
              用户提交下单需由商户审核，审核请勿拖延时间过长，以免引起用户投诉
            </Form.Item>
          )}

          {joinCart === 0 && (
            <Form.Item label="截图" className="flexr">
              <Form.Item name="joinCartScreenShot">
                <Radio.Group>
                  <Radio value={0}>需要截图</Radio>
                  <Radio value={1}>无需截图</Radio>
                </Radio.Group>
              </Form.Item>
              <div>
                选择需要截图，则买手会将图片上传后审核，建议不要大批量的发布需要截图的任务，会触发风控
              </div>
            </Form.Item>
          )}
          {joinCart === 0 && (
            <Form.Item label="店家要求">
              <Editor store={store} noTitle={true} />
            </Form.Item>
          )}
          {joinCart === 0 && <div className="explain">加购物车后立即开启下一步任务</div>}

          <StepTitle title="下单" step="4"></StepTitle>
          <Form.Item label="审核方式" className="flexr">
            <Form.Item name="confirmOrder">
              <Radio.Group>
                <Radio value={0}>商户审核</Radio>
              </Radio.Group>
            </Form.Item>
            <span className="redTxt mr10">+0元</span>
            用户提交下单需由商户审核，审核请勿拖延时间过长，以免引起用户投诉
          </Form.Item>
          <Form.Item label="截图" className="flexr">
            <Form.Item name="confirmOrderScreenShot">
              <Radio.Group>
                <Radio value={0}>需要截图</Radio>
                <Radio value={1}>无需截图</Radio>
              </Radio.Group>
            </Form.Item>
            <div>
              选择需要截图，则买手会将图片上传后审核，建议不要大批量的发布需要截图的任务，会触发风控
            </div>
          </Form.Item>
          <Form.Item label="支持项" className="flexr">
            <Form.Item name="confirmSupport">
              <Checkbox.Group
                options={[
                  { label: '信用卡付款', value: 'creditCard' },
                  { label: '花呗', value: 'huabei' },
                  { label: '淘金币', value: 'taojinbi' },
                  { label: '优惠券', value: 'coupon' },
                ]}
              />
            </Form.Item>
            <div>不支持上述项请不要勾选</div>
          </Form.Item>
          <Form.Item
            label="运费"
            name="confirmFare"
            rules={[{ required: true, message: '请选择运费!' }]}
          >
            <Select style={{ width: 220 }}>
              <Option value="free">包邮</Option>
              <Option value="advance">垫付</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default TaskStep;
