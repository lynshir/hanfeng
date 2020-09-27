// 框架
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Radio, Select, Button, Steps } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import { PageTitle, CardTitle } from '@comp/TitleRow';

import '../index.scss';
import jingdong from '@assets/img/jingdong.png';
import taobao from '@assets/img/taobao.png';
import pdd from '@assets/img/pdd.png';

const { Option } = Select;

function PlatImg({ type }) {
  if (type === 'tb') return <img alt="" className="ptImg" src={taobao} />;
  if (type === 'pdd') return <img alt="" className="ptImg" src={pdd} />;
  if (type === 'jd') return <img alt="" className="ptImg" src={jingdong} />;
}

@observer
class BaseConfig extends Component {
  componentDidMount() {
    // store.getCategory();
    this.props.store.getShopDic();
  }

  render() {
    const {
      platType,
      changePlat,
      onGenderChange,
      shopDic,
      shopChange,
      genderType,
      nextStep,
    } = this.props.store;
    return (
      <div className="baseConfig">
        <CardTitle title="平台选择" />
        <div className="flex plWrap mt20 mb20">
          {platType &&
            platType.map((v) => {
              const { type, code, active, open, title, tip } = v;
              return (
                <div
                  key={code}
                  disabled={!open}
                  onClick={open ? changePlat.bind(this, code) : () => {}}
                  className={`${active ? 'activePan' : ''} ${
                    open ? 'isOpen' : 'notOpen'
                  } flex platPannel`}
                >
                  <PlatImg type={type} />
                  <div className="flexc titWrap">
                    <span className="tit">{title}</span>
                    <span className="tip">{tip}</span>
                  </div>
                  {active && <CheckCircleOutlined className="plCheck" />}
                </div>
              );
            })}
        </div>
        <CardTitle title="店铺选择" />
        <div className="flex flex-lc mt20 mb20">
          <span className="redTxt">*</span>
          <span>选择店铺：</span>
          <Select style={{ width: 200 }} onChange={shopChange}>
            {shopDic.map((v) => {
              return (
                <Option key={v.id} value={v.id}>
                  {v.shopName}
                </Option>
              );
            })}
          </Select>
        </div>
        <CardTitle title="分配接单配置" />
        <div className="flex flex-lc mt20">
          <span>性别：</span>
          <Radio.Group onChange={onGenderChange} value={genderType}>
            <Radio value={0}>不限</Radio>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </div>
        <div className="mt20 flex" style={{ justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={nextStep}>
            下一步
          </Button>
        </div>
      </div>
    );
  }
}
export default BaseConfig;
