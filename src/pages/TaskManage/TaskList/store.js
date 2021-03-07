import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet, commonPost } from '@utils/egFetch';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { extendMoment } from 'moment-range';

import toolFn from '@utils/toolFn';

const undef = void 0;

const initPage = {
  page: 1,
  pageSize: 20,
  sord: '',
  sidx: '',
};

export default class TaskListModel {
  constructor(options) {
    extendObservable(this, {
      parent: {},
      taskListRef: {},
      plaformDic: [
        { code: 1, name: '淘宝' },
        { code: 2, name: '京东' },
        { code: 3, name: '拼多多' },
      ],
      shopDic: [
        { code: 1, name: '淘宝' },
        { code: 2, name: '京东' },
      ],
      statusDic: [
        { code: 1, name: '未完成' },
        { code: 2, name: '进行中' },
      ],
      finishStatus: [
        { code: true, name: '无剩余' },
        { code: false, name: '有剩余' },
      ],
      taskTypeDic: [
        { code: 0, name: '未开始' },
        { code: 1, name: '进行中' },
        { code: 2, name: '已结束' },
        { code: 3, name: '草稿' },
      ],
      totalInfo: {
        taskToal: 30,
        jd: 0,
        yjd: 10,
        ywc: 10,
        wwc: 20,
      },
      dataList: [],
      pagination: {
        ...initPage,
      },
      get filter() {
        const { pagination } = this;
        const fields = this.taskListRef.getFieldsValue();
        const vo = Object.keys(fields).reduce((pre, cur) => {
          const v = fields[cur];
          return v
            ? {
                ...pre,
                cur: v,
              }
            : {
                ...pre,
              };
        }, {});
        const result = {
          vo: { ...vo },
          ...pagination,
        };
        return result;
      },
      ...(options || {}),
    });
  }

  setTaskStepRef = (ref) => (this.taskListRef = ref);

  @action
  getShopDic = () => {
    commonPost('/shop/query', { page: 1, pageSize: 1000 }).then((v) => {
      if (v.status === 'Successful') {
        const list = v?.data?.list || [];
        this.shopDic = list.map((v) => {
          const { shopName, id } = v;
          return {
            name: shopName,
            code: id,
          };
        });
      }
    });
  };

  onSearch = action(() => {
    const { filter } = this;
    commonPost('/taskOrder/query', filter).then((v) => {
      if (v.status === 'Successful') {
        const data = v?.data || {};
        const { list, page, pageSize, totalCount, totalPageCount } = data;
        this.dataList = list;
        this.pagination = {
          page,
          pageSize,
          totalCount,
          totalPageCount,
        };
      }
    });
  });
}
