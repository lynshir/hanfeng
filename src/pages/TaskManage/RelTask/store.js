import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet, commonPost } from '@utils/egFetch';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import toolFn from '@utils/toolFn';

const exMoment = extendMoment(moment);

const undef = void 0;
const initProduct = {
  nameOrder: undef,
  itemUrl: undef,
  num: undef,
  price: undef,
  address: undef,
  payNum: undef,
  minPrice: undef,
  maxPrice: undef,
};

export default class RelTaskModel {
  constructor(options) {
    extendObservable(this, {
      parent: {},
      platType: [
        {
          type: 'tb',
          code: 1,
          active: true,
          open: true,
          title: '手机淘宝APP搜索下单任务',
          tip: '手机淘宝搜索高权重任务',
        },
        {
          type: 'tb',
          code: 2,
          active: false,
          open: true,
          title: '手机淘宝APP真实刷搜索流量',
          tip: '手机淘宝真实刷搜索流量高权重',
        },
        {
          type: 'tb',
          code: 3,
          active: false,
          open: true,
          title: '手机淘宝APP真实收藏加购',
          tip: '真实用户收藏加购，大促刷购物车可用',
        },
        {
          type: 'tb',
          code: 4,
          active: false,
          open: true,
          title: '隔日单淘宝APP搜索关键词下单',
          tip: '隔日单',
        },
        {
          type: 'tb',
          code: 5,
          active: false,
          open: true,
          title: '隔日单淘宝APP隔日从购物车下单',
          tip: '隔日单淘宝APP隔日从购物车下单',
        },
        {
          type: 'jd',
          code: 6,
          active: false,
          open: false, //是否启用
          title: '京东下单付款任务（内测中）',
          tip: '京东下单付款任务目前正在内测中，请关注平台实时动态，更多优惠发单价格。',
        },
        {
          type: 'pdd',
          code: 7,
          active: false,
          title: '拼多多下单付款任务（测试中）',
          tip: '拼多多下单付款任务目前正在内测中，请关注平台实时动态，更多优惠发单价格。',
        },
      ], //平台类型
      priceArea: [], //价格区间
      shopDic: [], //店铺字典
      curStep: 0, //当前步骤
      shopId: null,
      productRef: null, //商品ref
      timeRangeRef: null, //时间范围ref
      taskStepRef: null, //时间范围ref
      genderType: 2, //分配接单配置-性别
      taskName: '',
      productForms: {}, //商品信息forms
      productList: [cloneDeep(initProduct)], //商品列表
      proCategory: 'a', //商品类目
      cate: '', //商品类目选择值
      proItemOptions: [], //商品类目数组
      productSaveList: [], //商品列表保存用
      avgDateSetMap: {}, //平均设置
      manualDateSetMap: {}, //手动设置
      taskRequestType: 0, //任务请求类型
      sellerRequest: '', //任务要求 - 店家要求 富文本
      extraRq: '', //额外要求
      timeRange: {
        //时间范围
        splitType: 0, //分配类型
        timeRangeAvg: null,
        taskNum: 0,
        finishTime: null,
        timeSet: null,
      },
      taskStep: {},
      keywordNumList: [{ keyword: undefined, num: undefined }],
      editorState: BraftEditor.createEditorState(null), //富文本编辑
      taskStepList: [],
      resultData: {}, //保存数据
      get totalOrders() {
        const {
          avgDateSetMap,
          manualDateSetMap,
          timeRange: { splitType },
        } = this;
        const dateSetMap =
          splitType === 0 ? avgDateSetMap : splitType === 1 ? manualDateSetMap : {};
        let total = 0;
        Object.keys(dateSetMap).forEach((v) => {
          const item = dateSetMap[v];
          item.map(({ number }) => {
            total += Number(number);
          });
        });
        return total;
      },
      get feeDetail() {
        const { priceArea, resultData, productSaveList } = this;
        const { taskNum } = resultData; //任务数量
        const capital = productSaveList.reduce((pre, cur) => {
          return pre + cur.num * cur.price;
        }, 0); // 本金
        //基础佣金
        const cms = priceArea.find((v) => capital >= v.minPrice && capital <= v.maxPrice)
          .servicePrice;
        //运费
        const freight = 2;
        const data = [
          {
            category: '佣金',
            detail: `基础佣金：${cms}单`,
            taskNum,
            total: cms * taskNum,
          },
          {
            category: '本金',
            detail: `返还本金：${capital}/单`,
            taskNum,
            total: capital * taskNum,
          },
          {
            category: '运费',
            detail: `返还运费：0.00/单`,
            taskNum,
            total: 0,
          },
          {
            category: '服务费',
            detail: `返还运费：${freight.toFixed(2)}/单`,
            taskNum,
            total: freight * taskNum,
          },
        ];
        return data;
      },
      get confirmTaskInfo() {
        const { platType, shopDic, shopId, timeRange: { taskNum }, productSaveList, resultData: { taskStepList } } = this
        const taskType = platType.find(v => v.active === true).title
        const shopName = shopDic.find(v => v.id === shopId).shopName
        const proTitle = productSaveList.map(v => v.title).join(';');
        const proPrice = productSaveList.map(v => v.price).join(';');
        const proNum = productSaveList.map(v => v.num).join(';');
        let tsTxt = '' //taskStepTxt
        const needShot = (isNeed) => isNeed ? '需要截图' : '无需截图'
        for (let i = 0; i < taskStepList.length; i++) {
          const item = taskStepList[i];
          const { stepType, screenShot } = item
          switch (stepType) {
            case 1:
              tsTxt += (`收藏商品（${needShot(screenShot)}）-`);
              break;
            case 2:
              tsTxt += (`额外要求（${needShot(screenShot)}）-`);
              break;
            case 3:
              tsTxt += (`加购物车（${needShot(screenShot)}）-`);
              break;
            case 4:
              tsTxt += (`下单（${needShot(screenShot)}）-`);
              break;
            default:
              break;
          }
        }
        return [
          { item: '任务类型', info: taskType },
          { item: '店铺', info: shopName },
          { item: '商品标题', info: proTitle },
          { item: '商品实际成交价（单件）', info: proPrice },
          { item: '拍下件数', info: proNum },
          { item: '发布数量', info: taskNum },
          { item: '任务步骤', info: tsTxt },
        ]
      },
      ...(options || {}),
    });
  }

  setProductRef = (ref) => (this.productRef = ref);
  setTimeRangeRef = (ref) => (this.timeRangeRef = ref);
  setTaskStepRef = (ref) => (this.taskStepRef = ref);

  @action
  getShopDic = () => {
    commonPost('/shop/query', { page: 1, pageSize: 1000 }).then((v) => {
      if (v.status === 'Successful') {
        this.shopDic = v.data.list;
      }
    });
  };

  @action
  getPrice = () => {
    commonGet('/itemPrice/get').then((v) => {
      if (v.status === 'Successful') {
        if (_.isObject(v.data)) {
          this.priceArea = v.data;
        }
      }
    });
  };

  @action
  handleChangeTaskRq = (v) => {
    console.log('handleChangeTaskRq -> v', v);
    this.taskRequestType = v;
  };

  @action
  shopChange = (v) => {
    console.log('shopChange -> v', v);
    this.shopId = v;
  };

  @action
  onEditorBlur = (type, html) => {
    console.log('onEditorBlur -> type, html---', type, html);
    if (type === 'sellerRequest') this['sellerRequest'] = html;
    if (type === 'extraRq') this['extraRq'] = html;
  };

  //获取商品分类
  @action
  getCategory = (targetOption, parentCategoryId) => {
    commonGet(`/cate/get`).then((v) => {
      if (v.status !== 'Successful') return message.error('请求分类错误！');
      const data = this.dealData(v.data);
      console.log(data, '商品分类');
      this.proItemOptions = data;
    });
  };

  //选择商品分类
  @action
  proItemChange = (value, selectedOptions) => {
    console.log('proItemChange -> value', value, toJS(selectedOptions));
    const str = selectedOptions.reduce((pre, cur) => {
      return pre ? pre + '/' + cur.label : cur.label;
    }, '');
    this.cate = str;
  };

  //处理分类数据
  dealData = (sNodes) => {
    let i,
      l,
      key = 'id',
      parentKey = 'pid',
      childKey = 'children';
    if (!key || key == '' || !sNodes) return [];

    if (Array.isArray(sNodes)) {
      let r = [];
      let tmpMap = [];
      for (i = 0, l = sNodes.length; i < l; i++) {
        let node = sNodes[i];
        node['label'] = node['cateName'];
        node['value'] = node[key];
        tmpMap[node[key]] = node;
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
          if (!tmpMap[sNodes[i][parentKey]][childKey]) tmpMap[sNodes[i][parentKey]][childKey] = [];
          tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    } else {
      return [sNodes];
    }
  };

  //获取商品信息
  @action
  getProductInfo = (i) => {
    console.log(toJS(this.productSaveList), i);
    const pItem = this.productSaveList[i];
    const itemUrl = pItem['itemUrl'];
    if (!itemUrl) return;
    commonGet('/product/getProduct?url=' + encodeURIComponent(itemUrl)).then((v) => {
      if (v.status === 'Successful') {
        console.log('getProductInfo -> v', v);
        const arr = toJS(this.productSaveList);
        let temp = arr[i];
        let obj = Object.assign({}, temp, v.data);
        arr[i] = obj;
        this.productList = arr;
        this.productSaveList[i] = obj;
      }
    });
  };

  onKeywordChange = action((key, i, e) => {
    this.keywordNumList[i][key] = e.target.value;
  });

  //添加一项关键词
  onAddKeyWord = action(() => {
    this.keywordNumList.push({ keyword: undefined, num: undefined });
  });

  //删除一项关键词
  onDeleteKeyWord = action((i) => {
    this.keywordNumList.splice(i, 1);
  });

  //任务配置 - 任务步骤Formchange
  onTaskFormChange = action((changedFields, allFields) => {
    console.log('onTaskFormChange -> changedFields, allFields', changedFields, allFields);
    this.taskStep = allFields;
  });
  // 任务配置 - 时间范围Form
  @action
  onTimeRangeFieldsChange = (changedFields, allFields) => {
    console.log(
      'TimeRange -> onFieldsChange -> changedFields, allFields',
      changedFields,
      allFields,
    );
    if (changedFields.length) {
    }
    this.timeRange = allFields.reduce((pre, cur) => {
      const { name, value } = cur;
      const _name = String(name);
      let _value = null;
      switch (_name) {
        case 'timeRangeAvg':
          if (!value) {
            _value = value;
            break;
          }
          _value = Array.isArray(value)
            ? value.map((v) => v.format('YYYY-MM-DD hh:mm:ss'))
            : value.format('YYYY-MM-DD hh:mm:ss');
          break;
        case 'timeRangeManual':
          if (!value) {
            _value = value;
            break;
          }
          _value = Array.isArray(value)
            ? value.map((v) => v.format('YYYY-MM-DD hh:mm:ss'))
            : value.format('YYYY-MM-DD hh:mm:ss');
          break;
        case 'startTime':
          if (!value) {
            _value = value;
            break;
          }
          _value = value.format('YYYY-MM-DD hh:mm:ss');
          break;
        case 'finishTime':
          if (!value) {
            _value = value;
            break;
          }
          _value = value.format('YYYY-MM-DD hh:mm:ss');
          break;
        default:
          _value = value;
          break;
      }
      return { ...pre, [_name]: _value };
    }, {});
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.sendOrderSet();
    });
    // setTimeout(() => console.log(toJS(this.timeRange), 'timeRange'));
  };

  // 任务配置 - 发货时间段设置
  @action
  sendOrderSet = () => {
    console.log(this.timeRangeRef.getFieldsValue(), 'this.setTimeRangeRef.getFieldsValue()');
    const {
      splitType,
      taskNum,
      timeRangeAvg,
      timeRangeManual,
    } = this.timeRangeRef.getFieldsValue();
    if (!taskNum || taskNum < 0) return;
    if (splitType === 0 && !timeRangeAvg) return;
    if (splitType === 1 && !timeRangeManual) return;
    if (splitType === 0) {
      let [start, end] = timeRangeAvg;
      start = start.valueOf(); //毫秒
      end = end.valueOf(); //毫秒

      const sub = end.valueOf() - start.valueOf();
      if (sub <= 0) return;
      const space = sub / taskNum;
      const dateSet = {};
      for (let i = 1; i <= taskNum; i++) {
        const ns = start + space * i; //n个space
        const year = moment(ns).format('YYYY-MM-DD');
        const hour = moment(ns).format('HH:mm:ss');
        if (dateSet[year]) {
          dateSet[year].push({ hour, number: 1 });
        } else {
          dateSet[year] = [{ hour, number: 1 }];
        }
      }
      this.avgDateSetMap = dateSet;
      console.log(dateSet, 'dateSetdateSet');
    }
    if (splitType === 1) {
      let [start, end] = timeRangeManual;
      const range = exMoment.range(exMoment(start), exMoment(end));
      const diffDays = range.diff('days');
      const dateSet = {};
      for (let days of range.by('days')) {
        const d = days.format('YYYY-MM-DD');
        for (let j = 0; j < 23; j++) {
          const h = j < 10 ? '0' + j : j;
          if (dateSet[d]) {
            dateSet[d].push({ hour: h + ':00:00', number: '' });
          } else {
            dateSet[d] = [{ hour: h + ':00:00', number: '' }];
          }
        }
      }
      this.manualDateSetMap = dateSet;
    }
  };
  // 任务配置 - 发单input
  @action
  onDateSetChange = (year, hour, e) => {
    console.log('RelTaskModel -> onDateSetChange -> year,hour', year, hour, e.target.value);
    const { splitType } = this.timeRangeRef.getFieldsValue();
    const { avgDateSetMap, manualDateSetMap } = this;
    try {
      manualDateSetMap[year].find((v) => v.hour === hour).number = e.target.value;
    } catch (error) {
      console.log(error);
    }
  };

  // 任务配置 - 商品信息配置部分Form
  @action
  onFormItemChange = (formName, changedFields, forms) => {
    console.log(
      'RelTaskModel -> onFormItemChange -> formName, changedFields, forms ---',
      formName,
      changedFields,
      forms,
    );
    this.productForms = forms;
    if (changedFields.length) {
      const saveList = toJS(this.productSaveList);
      const formList = Object.keys(forms).map((v) => forms[v].getFieldsValue());
      if (!saveList.length) {
        this.productSaveList = formList;
      } else {
        formList.forEach((el, i) => {
          saveList[i] ? Object.assign(saveList[i], el) : (saveList[i] = el);
        });
        this.productSaveList = saveList;
      }
    }
  };

  //任务配置 - 新增商品
  @action
  onAddProduct = () => {
    let { productSaveList } = this;
    this.productList = cloneDeep(productSaveList);
    this.productList.push({ ...initProduct });
    this.productSaveList.push({ ...initProduct });
  };
  //任务配置 - 新增商品
  @action
  onDeleteProduct = (index) => {
    this.productSaveList.splice(index, 1);
    this.productList = cloneDeep(this.productSaveList);
  };

  //基础配置 - 平台选择
  @action
  changePlat = (code) => {
    console.log('RelTaskModel -> changePlat -> code', code);
    const { platType } = this;
    platType.forEach(
      action((element) => {
        element.active = false;
      }),
    );
    platType.find((v) => v.code === code).active = true;
  };

  //基础配置 - 性别选择
  @action
  onGenderChange = (e) => {
    console.log('RelTaskModel -> onGenderChange -> e', e.target.value);
    this.genderType = e.target.value;
  };

  //基础配置 - inputChange
  @action
  onInputChange = (type, e) => {
    console.log('onInputChange -> type, e', type, e.target.value);
    this[type] = e.target.value;
  };

  getTimeRange = () => {
    const { timeRangeRef, avgDateSetMap, manualDateSetMap } = this;
    const {
      splitType,
      taskNum,
      timeRangeAvg,
      timeRangeManual,
      finishTime,
    } = timeRangeRef.getFieldsValue();
    console.log(timeRangeRef.getFieldsValue(), 'timeRangeRef.getFieldsValue()');
    let startTime = '',
      endTime = '';
    let hm = 'YYYY-MM-DD hh:mm:ss',
      ym = 'YYYY-MM-DD';
    if (splitType === 0) {
      if (!timeRangeAvg) {
        return message.error('请选择日期范围'), false;
      }
      [startTime, endTime] = [timeRangeAvg[0].format(hm), timeRangeAvg[1].format(hm)];
      if (!startTime || !endTime) return message.error('请选择日期范围'), false;
    }
    if (splitType === 1) {
      if (!timeRangeManual) {
        return message.error('请选择日期范围'), false;
      }
      [startTime, endTime] = [timeRangeManual[0].format(ym), timeRangeManual[1].format(ym)];
      if (!startTime || !endTime) return message.error('请选择日期范围'), false;
    }
    if (splitType === 2) {
      startTime = timeRangeRef;
      if (!startTime) return message.error('请选择开始时间'), false;
    }
    if (!finishTime) return message.error('请选择终止时间'), false;
    let taskSplitTimeNumList = Object.keys(
      splitType === 0 ? avgDateSetMap : splitType === 1 ? manualDateSetMap : {},
    ).reduce((pre, cur) => {
      return [
        ...pre,
        ...avgDateSetMap[cur].map((v) => {
          return {
            time: cur + ' ' + v.hour,
            num: v.number,
          };
        }),
      ];
    }, []);
    return {
      splitType,
      taskNum,
      startTime,
      endTime,
      finishTime: finishTime.format(hm),
      taskSplitTimeNumList,
    };
  };

  getTaskStep = () => {
    const {
      collect,
      collectReview,
      collectScreenShot,
      extReq,
      extReqReview,
      extReqScreenShot,
      joinCart,
      joinCartReview,
      joinCartScreenShot,
      confirmOrderScreenShot,
      confirmSupport = [],
      confirmOrder,
      confirmFare,
    } = this.taskStepRef.getFieldsValue();
    const { extraRq } = this;
    const taskStepList = [];
    if (collect === 1) {
      taskStepList.push({
        stepType: 1,
        approveType: collectReview,
        screenShot: collectScreenShot,
        otherRequest: '',
      });
    }
    if (extReq === 1) {
      taskStepList.push({
        stepType: 2,
        approveType: extReqReview,
        screenShot: extReqScreenShot,
        otherRequest: extraRq,
      });
    }
    if (joinCart === 1) {
      taskStepList.push({
        stepType: 3,
        approveType: joinCartReview,
        screenShot: joinCartScreenShot,
        otherRequest: '',
      });
    }
    taskStepList.push({
      stepType: 4,
      approveType: confirmOrder,
      screenShot: confirmOrderScreenShot,
      otherRequest: '',
      payType: confirmSupport.join(','),
      freeShipping: confirmFare,
    })
    this.taskStepList = taskStepList;
    return taskStepList;
  };

  validatePage = () => {
    const {
      shopId,
      platType,
      genderType,
      taskName,
      productForms,
      cate,
      productSaveList,
      taskRequestType,
      keywordNumList,
      searchKey, //TODO:
      sellerRequest,
    } = this;
    if (!taskName) {
      message.error('请输入任务名称');
      return false;
    }
    let taskType = platType.find((v) => v.active).code;
    let itemList = toJS(productSaveList);
    console.log('publish -> itemList', itemList);
    for (let i = 0; i < itemList.length; i++) {
      const { itemId, itemUrl, shopName, title, num, price, address, payNum } = itemList[i];
      if (!itemId || !itemUrl || !shopName || !title) return message.error('请获取商品链接'), false;
      if (!num) return message.error('输入拍下件数'), false;
      if (!price) return message.error('输入商品单价'), false;
      if (!address) return message.error('请输入店铺所在地址'), false;
      if (!payNum) return message.error('请输入付款人数'), false;
    }

    let timeRange = this.getTimeRange();
    if (!timeRange) return false;

    for (let i = 0; i < keywordNumList.length; i++) {
      const { keyword, num } = keywordNumList[i];
      if (!keyword || !num) {
        message.error('请输入关键词和数量！');
        return false;
      }
    }

    // const totalNum = keywordNumList.reduce((pre, cur) => {
    //   return pre + cur.num
    // }, 0)
    // let taskNum = timeRange.taskNum;
    // if (totalNum > taskNum) return message.error('关键词单量超出了发布总量！');

    let taskStepList = toJS(this.getTaskStep());
    const result = {
      taskType,
      shopId,
      genderType,
      taskName,
      cate,
      itemList,
      taskRequestType,
      keywordNumList: toJS(keywordNumList),
      searchKey,
      sellerRequest,
      taskStepList,
      ...this.getTimeRange(),
    };
    this.resultData = result;
    console.log(result, '---result');
    return result;
  };

  publish = (status) => {
    const result = this.resultData;
    if (status) { result.status = 3 }
    commonPost('/taskOrder/insert', result).then((v) => {
      if (v.status !== 'Successful') return message.error(v.data);
      return message.success('新建成功！')
    });
  };

  @action
  nextStep = () => {
    const { curStep, shopId } = this;
    if (curStep < 2) {
      if (curStep === 0) {
        if (!shopId) return message.error('请选择店铺！');
      }
      if (curStep === 1) {
        const result = this.validatePage();
        if (!result) return;
      }
      this.curStep++;
    }
  };
  @action
  prevStep = () => {
    if (this.curStep > 0) {
      this.curStep--;
    }
  };
}
