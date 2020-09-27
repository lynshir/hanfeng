// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Select, Upload, Input, InputNumber } from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
      store: {
        keywordNumList,
        onAddKeyWord,
        onDeleteKeyWord,
        onKeywordChange,
        taskRequestType,
        handleChangeTaskRq,
      },
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
            <Select
              style={{ minWidth: 200 }}
              value={taskRequestType}
              defaultValue={0}
              onChange={handleChangeTaskRq}
            >
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
        <Row align="middle">
          <Col span="4">关键词：</Col>
          <Col>
            {keywordNumList.map(({ keyword, num }, i) => {
              return (
                <Row
                  key={i}
                  gutter={1}
                  align="center"
                  justify="center"
                  className="mt10"
                  style={{ lineHeight: '32px' }}
                >
                  <Col>
                    <Input
                      value={keyword}
                      onChange={onKeywordChange.bind(this, 'keyword', i)}
                      placeholder="请输入关键词"
                    />
                  </Col>
                  <Col>
                    <Input
                      value={num}
                      onChange={onKeywordChange.bind(this, 'num', i)}
                      placeholder="请输入"
                    />
                  </Col>
                  <Col>单</Col>
                  <Col className="ml10">
                    <PlusCircleOutlined onClick={onAddKeyWord.bind(this, i)} className="mr10" />
                    {keywordNumList.length > 1 && (
                      <MinusCircleOutlined onClick={onDeleteKeyWord.bind(this, i)} />
                    )}
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
        <Editor onBlur={store.onEditorBlur.bind(this, 'sellerRequest')} store={store} />
      </div>
    );
  }
}
export default TaskReq;
