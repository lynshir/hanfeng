import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet } from '@utils/egFetch';
import _ from 'lodash';
export default class Store {
  constructor(options) {
    extendObservable(this, {
      dataSource: [],
      priceData: [],
      userInfo: {},
      ...(options || {}),
    });
  }

  columns = [
    {
      title: '商品价格区间',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'servicePrice',
      key: 'servicePrice',
      align: 'center',
    },
    {
      title: '商品价格区间',
      dataIndex: 'price1',
      key: 'price1',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'servicePrice1',
      key: 'servicePrice1',
      align: 'center',
    },
  ];

  @action
  getUser = () => {
    commonGet('/user/getUser').then((v) => {
      if (v.status === 'Successful') {
        if (_.isObject(v.data)) {
          this.userInfo = v.data;
        }
      }
    });
  };

  @action
  getPrice = () => {
    commonGet('/itemPrice/get').then((v) => {
      if (v.status === 'Successful') {
        if (_.isObject(v.data)) {
          let arr = v.data;
          this.priceData = _.cloneDeep(arr);
          let len = arr.length;
          let index = Math.ceil(len / 2);
          let arrFront = arr.slice(0, index);
          let arrBack = arr.slice(index);
          arrBack.forEach((el, i) => {
            arrFront[i].price1 = el.price;
            arrFront[i].servicePrice1 = el.servicePrice;
          });
          console.log(arrFront, 'arrFront');
          this.dataSource = arrFront;
        }
      }
    });
  };

  //获取邀请码
  @action
  getInvit = () => {
    commonGet('/user/getInvitationCode').then((v) => {});
  };

  @action
  getCategory = (targetOption, parentCategoryId) => {
    console.log('准备请求targetOption', targetOption);
    commonGet(
      `/api/gim/category/findOneLevel?categoryType=26&parentCategoryId=${parentCategoryId || 0}`,
    ).then((v) => {
      if (v.status !== 'Successful') return message.error('请求分类错误！');
      if (targetOption) {
        targetOption.loading = false;
        targetOption.children = this.dealData(v.data);
        return (this.options = [...this.options]);
      }
      this.options = this.dealData(v.data);
    });
  };
}
