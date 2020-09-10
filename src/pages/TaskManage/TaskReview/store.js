import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet } from '@utils/egFetch';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { extendMoment } from 'moment-range';

import toolFn from '@utils/toolFn';

const undef = void 0;

export default class TaskListModel {
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
            jdsj: `接单时间 ${i}`,
            productID: 32,
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
        title: '接单时间',
        dataIndex: 'jdsj',
      },
      {
        title: '商品ID',
        dataIndex: 'productID',
      },
      {
        title: '实付金额',
        dataIndex: 'payAccout',
      },
      {
        title: '商品总价',
        dataIndex: 'productTotal',
      },
      {
        title: '完成时间',
        dataIndex: 'completeTime',
      },
      {
        title: '平台',
        dataIndex: 'platform',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '任务店铺',
        dataIndex: 'shop',
      },
      {
        title: '平台账号',
        dataIndex: 'platAccout',
      },
      {
        title: '收件人姓名',
        dataIndex: 'reciverName',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
      },
      {
        title: '订单编号',
        dataIndex: 'orderNo',
      },
      {
        title: '任务编号',
        dataIndex: 'taskNo',
      },
      {
        title: '用户提交时间',
        dataIndex: 'submitTime',
      },
      {
        title: '任务审核时间',
        dataIndex: 'reviewTime',
      },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        render: () => <span>action</span>,
      },
    ].map((v) => {
      return {
        ...v,
        width: 150,
      };
    });
  };
}
