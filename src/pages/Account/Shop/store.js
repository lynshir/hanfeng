import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet, commonPost } from '@utils/egFetch';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { extendMoment } from 'moment-range';

import toolFn from '@utils/toolFn';

const undef = void 0;

const initPagination = {
  current: 1,
  pageSize: 10,
  total: 0,
  totalPageCount: 0,
};
export default class ShopStore {
  constructor(options) {
    extendObservable(this, {
      parent: {},
      totalInfo: {
        taskToal: 30,
        jd: 0,
        yjd: 10,
        ywc: 10,
        wwc: 20,
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        totalPageCount: 0,
      },
      dataSource: [],
      show: false,
      shopRef: null,
      get filter() {
        const { current, pageSize } = this.pagination;
        return {
          page: current,
          pageSize,
        };
      },
      ...(options || {}),
    });
  }

  setShopRef = (ref) => (this.shopRef = ref);

  onSearch = action(() => {
    commonPost('/shop/query', this.filter).then((v) => {
      if (v.status === 'Successful') {
        const { page, pageSize, totalCount, totalPageCount, list } = v.data;
        this.pagination = {
          current: page,
          pageSize,
          total: totalCount,
          totalPageCount,
        };
        this.dataSource = list;
      }
    });
  });

  onTableChange = action((pagination, filters, sorter, extra) => {
    console.log(
      'ShopStore -> onTableChange -> pagination, filters, sorter, extra ---- ',
      pagination,
      filters,
      sorter,
      extra,
    );
    Object.assign(this.pagination, pagination);
    this.onSearch();
  });

  openModal = action(() => {
    this.show = true;
  });

  handleOk = action(() => {
    this.shopRef
      .validateFields()
      .then((v) => {
        console.log('ShopStore -> handleOk -> v', v);
        commonPost('/shop/save', v).then((k) => {
          if (k.status === 'Successful') {
            this.show = false;
            this.pagination = initPagination;
            this.onSearch();
          }
        });
      })
      .catch((errorInfo) => {});
  });

  handleCancel = action(() => {
    this.show = false;
  });

  getColunms = () => {
    return [
      {
        title: '店铺名称',
        dataIndex: 'shopName',
      },
      {
        title: '状态',
        dataIndex: 'shopStatus',
      },
      {
        title: '平台',
        dataIndex: 'platformTypeName',
      },
      {
        title: '完成任务数',
        dataIndex: 'totalNumber',
      },
      {
        title: '收件人',
        dataIndex: 'connectName',
      },
      {
        title: '收件人手机号',
        dataIndex: 'connectMobile',
      },
      {
        title: '收货地址',
        dataIndex: 'refundAddress',
      },
    ].map((v) => {
      return {
        ...v,
        width: 150,
      };
    });
  };
}
