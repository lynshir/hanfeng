import React from 'react';
import { extendObservable, action, toJS } from 'mobx';
import { message } from 'antd';
import { commonGet } from '@utils/egFetch';
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
  link: undef,
  bought: undef,
  unit: undef,
  address: undef,
  payNum: undef,
  priceMin: undef,
  priceMax: undef,
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
      curStep: 1,
      shopId: null,
      productRef: null, //商品ref
      timeRangeRef: null, //时间范围ref
      taskStepRef: null, //时间范围ref
      genderType: 2, //分配接单配置
      productList: [], //商品列表
      productSaveList: [], //商品列表保存用
      avgDateSetMap: {}, //平均设置
      manualDateSetMap: {}, //手动设置
      timeRange: {
        //时间范围
        allot: 0, //分配类型
        timeRangeAvg: null,
        releaseNum: 0,
        timeEnd: null,
        timeSet: null,
      },
      taskStep: {},
      editorState: BraftEditor.createEditorState(null), //富文本编辑
      get totalOrders() {
        const {
          avgDateSetMap,
          manualDateSetMap,
          timeRange: { allot },
        } = this;
        const dateSetMap = allot === 0 ? avgDateSetMap : allot === 1 ? manualDateSetMap : {};
        let total = 0;
        Object.keys(dateSetMap).forEach((v) => {
          const item = dateSetMap[v];
          item.map(({ number }) => {
            total += Number(number);
          });
        });
        return total;
      },
      ...(options || {}),
    });
  }

  setProductRef = (ref) => (this.productRef = ref);
  setTimeRangeRef = (ref) => (this.timeRangeRef = ref);
  setTaskStepRef = (ref) => (this.taskStepRef = ref);

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

  // 任务配置 - 富文本编辑

  //清空内容
  clearContent = action(() => {
    msg.confirm('确认清空吗？', () => {
      this.editorState = ContentUtils.clear(this.editorState);
    });
  });

  handleEditorChange = toolFn.debounce((editorState) => {
    console.log('TCL: EditorStore -> handleEditorChange -> editorState', editorState);
    this.editorState = editorState;
  }, 500);

  showImgUpload = action(() => {
    const {
      imgUploadStore,
      imgUploadStore: { myPCStore },
    } = this.parent;
    imgUploadStore.reset();
    imgUploadStore.saveFn = this.getMyPCPic(); //图片管家回调函数
    imgUploadStore.showModal();
  });
  //图片管家保存的回调函数
  getMyPCPic = action(() => {
    let basePicSave = action(() => {
      const { editorState } = this;
      const {
        imgUploadStore: { imgList },
      } = this.parent;
      const _editorState = ContentUtils.insertMedias(
        editorState,
        imgList.map((v) => ({
          type: 'IMAGE',
          url: v,
        })),
      );
      this.editorState = _editorState;
    });
    return basePicSave;
  });

  writeBackEditor = action((goodsPicVo, id) => {
    const { videoUrl } = goodsPicVo;
    //TODO:待请求html回写
    commonGet('/api/goods/rest/goodsPic/anon/queryGoodsHtml?id=' + id).then((v) => {
      console.log(v, 'htmlurl');
      if (v.data) {
        this.editorState = ContentUtils.insertHTML(this.editorState, v.data);
      }
    });
  });

  fullHtml = (content) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
       <title>详情预览</title>
       <meta charset="utf-8" />
       <meta http-equiv="Cache-Control" content="no-store" />
       <meta http-equiv="expires" content="0">
       <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
       <meta http-equiv="Pragma" content="no-cache">
       <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
    ${content}
    </body>
    </html>`;
  };

  validateContent = () => {
    let isEmpty = this.editorState.isEmpty();
    console.log(isEmpty, '富文本是否空！');
    if (isEmpty) return false;
    if (!isEmpty) {
      const { blocks } = this.editorState.toRAW(true);
      console.log(blocks, '富文本-blocks'); //FIXME:日后若校验错误，需要看这里用户输入的值都可能是什么，官方未提供校验回车空的方法
      for (let item of blocks) {
        const { text, entityRanges } = item;
        if (text.trim() || entityRanges.length) return true;
      }
      return false;
    }
  };

  relaseContent = async () => {
    if (!this.validateContent()) {
      msg.error('请填写图文详情！');
      return false;
    }
    const htmlContent = this.editorState.toHTML();
    // console.log(htmlContent);
    // const fullHtml = this.fullHtml(htmlContent)
    const formData = new FormData();
    formData.append('file', new File([htmlContent], 'index.html'));
    formData.append('moduleType', 'productDetail');
    formData.append('title', 'productDetailImg');
    return new Promise((resolve, reject) => {
      commonPost('/api/ossItem/uploadfile', {}, { headers: {}, body: formData }).then((v) => {
        if (v.status === 'Successful') {
          //返回html地址
          resolve(v);
        } else {
          reject(false);
        }
      });
    });
  };

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
        case 'timeEnd':
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
    const { allot, releaseNum, timeRangeAvg, timeRangeManual } = this.timeRangeRef.getFieldsValue();
    if (!releaseNum || releaseNum < 0) return;
    if (allot === 0 && !timeRangeAvg) return;
    if (allot === 1 && !timeRangeManual) return;
    if (allot === 0) {
      let [start, end] = timeRangeAvg;
      start = start.valueOf(); //毫秒
      end = end.valueOf(); //毫秒

      const sub = end.valueOf() - start.valueOf();
      if (sub <= 0) return;
      const space = sub / releaseNum;
      const dateSet = {};
      for (let i = 1; i <= releaseNum; i++) {
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
    if (allot === 1) {
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
    const { allot } = this.timeRangeRef.getFieldsValue();
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
      'RelTaskModel -> onFormItemChange -> formName, changedFields, forms',
      formName,
      changedFields,
      forms,
    );
    if (changedFields.length) {
      this.productSaveList = Object.keys(forms).map((v) => forms[v].getFieldsValue());
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

  @action
  nextStep = () => {
    const { curStep, shopId } = this;
    if (curStep < 2) {
      // if (curStep === 0) {
      //   if (!shopId) return message.error('请选择店铺！');
      // }
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
