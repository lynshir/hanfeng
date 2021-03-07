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
  Pagination,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import shortid from 'shortid';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import '../index.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@observer
class TaskPannel extends Component {
  componentDidMount() {
    // store.getCategory();
  }

  render() {
    const { dataList } = this.props.store;
    return (
      <div className="taskListPannel">
        <CardTitle title="任务列表" />
        <div className="mt20">
          <Button type="primary">终止任务</Button>
        </div>
        <div className="pannel">
          {dataList.map((v) => {
            const { title, createTime, task_order_no } = v;
            return (
              <Row>
                <Col span={16}>
                  <div className="flex flex-lc">
                    <img
                      alt=""
                      src="https://img.alicdn.com/imgextra/i2/2095638804/O1CN01znxBLJ2EuHa3HEr66_!!2095638804-0-lubanu-s.jpg"
                      className="taskPanImg mr10"
                    />
                    <div style={{ width: '70%' }}>
                      <Row className="f16 f500 mb10">{title}</Row>
                      <Row className="mb10">
                        <span>{createTime}</span>
                        <div className="smark">已结束</div>
                      </Row>
                      <Row>任务编号：{task_order_no}</Row>
                      <Row>店铺：{shopName}</Row>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="flexc justify-sb hp100">
                    <Row align="middle" justify="space-between">
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
                    <Row justify="space-between" align="middle">
                      <Col className="bgf2 pd5">2020-08-23 至 2020-08-23</Col>
                      <Col>复制</Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            );
          })}
        </div>
        <Row justify="flex-end">
          <Pagination
            total={85}
            showTotal={(total) => `共 ${total} 条`}
            defaultPageSize={20}
            defaultCurrent={1}
            showSizeChanger={true}
            size="small"
            pageSizeOptions={[10, 20, 50, 100]}
            current={1} //当前页数
            onChange={() => {}}
          />
        </Row>
      </div>
    );
  }
}
export default TaskPannel;
