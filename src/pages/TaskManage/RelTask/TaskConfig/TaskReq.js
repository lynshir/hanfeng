// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { toJS, action } from 'mobx';
import shortid from 'shortid';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import UploadOSS from './UploadOSS';
import Editor from './Editor';
import '../../index.scss';

const { Option } = Select;

@observer
class TaskReq extends Component {
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
      store: { nextStep, prevStep, onAddProduct },
    } = this.props;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div className="TaskQq mt20">
        <CardTitle title="任务要求" />
        <Row align="middle" className="mb20">
          <Col span="4">设置类型：</Col>
          <Col span="4">
            <Select style={{ minWidth: 200 }} onChange={this.handleChange}>
              <Option value={0}>关键词</Option>
              <Option value={1}>商品口令</Option>
              <Option value={2}>二维码</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span="4">二维码：</Col>
          <Col span="4">
            <UploadOSS />
          </Col>
        </Row>
        <Editor store={store} />
      </div>
    );
  }
}
export default TaskReq;
