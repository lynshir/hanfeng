import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet } from '@/utils/egFetch';

export default class Store {
  constructor(options) {
    extendObservable(this, {
      dataSource: [
        { jgqj: '00-100', price: '100.00' },
        { jgqj: '00-100', price: '100.00' },
        { jgqj: '00-100', price: '100.00' },
      ],
      ...(options || {}),
    });
  }

  columns = [
    {
      title: '商品价格区间',
      dataIndex: 'jgqj',
      key: 'jgqj',
      align: 'center'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center'
    },
  ];

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
