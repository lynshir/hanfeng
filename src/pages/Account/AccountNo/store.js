import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet } from '@utils/egFetch';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { extendMoment } from 'moment-range';

import toolFn from '@utils/toolFn';

const undef = void 0;

export default class AccountNoStore {
  constructor(options) {
    extendObservable(this, {
      parent: {},
      taskListRef: {},
      plaformDic: [
        { code: 1, name: '淘宝' },
        { code: 2, name: '京东' },
      ],
      shopDic: [
        { code: 1, name: '淘宝' },
        { code: 2, name: '京东' },
      ],
      statusDic: [
        { code: 1, name: '未完成' },
        { code: 2, name: '进行中' },
      ],
      completeDic: [
        { code: 1, name: '未完成' },
        { code: 2, name: '进行中' },
      ],
      taskTypeDic: [
        { code: 1, name: '手机淘宝APP搜索下单任务' },
        { code: 2, name: '京手机淘宝APP真实刷搜索流量' },
      ],
      totalInfo: {
        taskToal: 30,
        jd: 0,
        yjd: 10,
        ywc: 10,
        wwc: 20,
      },
      get dataSource() {
        const data = [];
        for (let i = 0; i < 100; i++) {
          data.push({
            key: i,
            sjzh: `接单时间 ${i}`,
            cjsj: 32,
            payAccout: `London Park no. ${i}`,
          });
        }
        return data;
      },
      get filter() {
        return this.taskReviewRef.getFieldsValue();
      },
      ...(options || {}),
    });
  }

  setTaskReviewRef = (ref) => (this.taskReviewRef = ref);

  onSearch = action(() => {
    console.log(this.filter);
  });

  getColunms = () => {
    return [
      {
        title: '商家账号',
        dataIndex: 'sjzh',
      },
      {
        title: '创建时间',
        dataIndex: 'cjsj',
      },
      {
        title: '操作',
        dataIndex: 'cz',
      },
    ].map((v) => {
      return {
        ...v,
        width: 150,
      };
    });
  };
}
