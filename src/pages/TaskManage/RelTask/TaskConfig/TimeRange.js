// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Radio, Select, Button, Form, Input, InputNumber, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import { PageTitle, CardTitle } from '@comp/TitleRow';
import { debounce, throttle } from 'lodash';

import '../../index.scss';
const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};

function disabledTodayBefore(current) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

@observer
class TimeRange extends Component {
  state = {
    dates: [],
  };

  componentDidMount() {
    // store.getCategory();
  }

  disabledFourDate = (current) => {
    const { dates } = this.state;
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 3;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 3;
    return tooEarly || tooLate;
  };

  setDateRange = (value) => {
    this.setState({ dates: value });
  };

  render() {
    const {
      setTimeRangeRef,
      onTimeRangeFieldsChange,
      timeRange: { splitType, taskNum },
      avgDateSetMap,
      manualDateSetMap,
      onDateSetChange,
      totalOrders,
    } = this.props.store;
    const dateSetMap = splitType === 0 ? avgDateSetMap : splitType === 1 ? manualDateSetMap : {};
    return (
      <div className="timeRange mt20">
        <CardTitle title="时间范围" />
        <Form
          {...formItemLayout}
          ref={setTimeRangeRef}
          name="control-ref"
          initialValues={{ splitType: 0 }}
          onFieldsChange={onTimeRangeFieldsChange}
        >
          <Form.Item name="splitType" label="分配类型">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={0}>平均分配</Radio.Button>
              <Radio.Button value={1}>手动分配</Radio.Button>
              <Radio.Button value={2}>定时分配</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {splitType === 0 && (
            <Form.Item name="timeRangeAvg" label="日期范围">
              <RangePicker
                showTime={{
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }}
              />
            </Form.Item>
          )}
          {splitType === 1 && (
            <Form.Item label="日期范围">
              <Form.Item name="timeRangeManual" noStyle>
                <RangePicker
                  disabledDate={this.disabledFourDate}
                  onCalendarChange={this.setDateRange}
                />
              </Form.Item>
              <span className="redTxt">*</span>
              <span>最多可设置4天内</span>
            </Form.Item>
          )}
          {splitType === 2 && (
            <Form.Item name="startTime" label="开始时间">
              <DatePicker showTime />
            </Form.Item>
          )}
          <Form.Item label="发布数量">
            <Form.Item name="taskNum" noStyle>
              <InputNumber placeholder="请输入发布数量" min={0} />
            </Form.Item>
            <span className="ml10">件</span>
          </Form.Item>
          <Form.Item name="finishTime" label="终止时间">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledTodayBefore}
              // disabledTime={disabledDateTime}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            />
          </Form.Item>
          <Form.Item label="发单时间段设置"></Form.Item>
        </Form>
        <div className="dateSetWrap">
          {Object.keys(dateSetMap).map((v) => {
            const hourList = dateSetMap[v];
            return (
              <Row key={v} gutter={[8, 8]}>
                <Col span={3} className="cl3 f500">
                  {v}
                </Col>
                <Col span={21}>
                  <Row gutter={[8, 8]}>
                    {hourList.map(({ hour, number }) => {
                      return (
                        <Col span={4} key={hour}>
                          <Input
                            addonBefore={hour}
                            value={number}
                            disabled={splitType === 0}
                            onChange={onDateSetChange.bind(this, v, hour)}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            );
          })}
        </div>
        <div>
          计划总单数：<span className="redTxt">{taskNum || 0}</span>单，已分配总计：
          <span className="redTxt">{totalOrders}单</span>
        </div>
      </div>
    );
  }
}
export default TimeRange;
