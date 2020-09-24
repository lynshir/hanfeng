//来将不留姓名
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import toolFn from '@utils/toolFn';

const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
};

BraftEditor.use(Table(options));

class Editor extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
    noTitle: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { noTitle, editorText } = nextProps;
    //TODO: 如果editorText有内容 通过this.setState设置文本，回写
    // 当传入的type发生变化的时候，更新state
    if (noTitle !== prevState.noTitle) {
      return {
        noTitle,
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  // 任务配置 - 富文本编辑
  //清空内容
  clearContent = () => {
    msg.confirm('确认清空吗？', () => {
      this.setState({
        editorState: ContentUtils.clear(this.state.editorState),
      });
    });
  };

  onBlur = () => {
    const { editorState } = this.state;
    const html = editorState.toHTML();
    console.log(html, 'editorState.toHTML()');
    const { onBlur } = this.props;
    onBlur && onBlur(html);
  };

  // handleEditorChange = toolFn.debounce((editorState) => {
  //   console.log('TCL: EditorStore -> handleEditorChange -> editorState', editorState);
  //   this.setState({
  //     editorState: editorState,
  //   });
  // }, 500);
  handleEditorChange = (editorState) => {
    console.log('TCL: EditorStore -> handleEditorChange -> editorState', editorState);
    this.setState({
      editorState: editorState,
    });
  };

  showImgUpload = () => {
    const { editorState } = this.state;
  };
  //图片管家保存的回调函数
  getMyPCPic = () => {
    let basePicSave = () => {
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
    };
    return basePicSave;
  };

  writeBackEditor = (goodsPicVo, id) => {
    const { videoUrl } = goodsPicVo;
    //TODO:待请求html回写
    commonGet('/api/goods/rest/goodsPic/anon/queryGoodsHtml?id=' + id).then((v) => {
      console.log(v, 'htmlurl');
      if (v.data) {
        this.setState({
          editorState: ContentUtils.insertHTML(this.editorState, v.data),
        });
      }
    });
  };

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
    const { editorState } = this.state;
    let isEmpty = editorState.isEmpty();
    console.log(isEmpty, '富文本是否空！');
    if (isEmpty) return false;
    if (!isEmpty) {
      const { blocks } = editorState.toRAW(true);
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
    const htmlContent = this.state.editorState.toHTML();
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

  render() {
    const { handleEditorChange, clearContent, showImgUpload, onBlur } = this,
      { noTitle, editorState } = this.state;
    const excludeControls = ['media']; //排除的组件
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <button
            type="button"
            className="control-item button upload-button"
            data-title="插入图片"
            onClick={showImgUpload}
          >
            {/* <Icon type="picture" /> */}插入图片
          </button>
        ),
      },
      {
        key: 'antd-clear',
        type: 'component',
        component: (
          <button
            type="button"
            className="control-item button clear-button"
            data-title="清空"
            onClick={clearContent}
          >
            {/* <Icon type="picture" /> */}清空
          </button>
        ),
      },
    ];
    return (
      <div className="editor">
        <Row className="row mt20">
          {!noTitle && (
            <Col span={4} className="labelTitle">
              店家要求
            </Col>
          )}
          <Col span={20}>
            <BraftEditor
              className="editorTool"
              value={editorState}
              onChange={handleEditorChange}
              onBlur={onBlur}
              // onSave={submitContent} 在编辑器获得焦点时按下ctrl+s会执行此方法,编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
              excludeControls={excludeControls} //排除的组件
              extendControls={extendControls} //额外的扩展
              placeholder="请输入具体步骤要求，如：1、根据关键词搜索浏览多个商品后找到本商品 2、浏览其他商品的详情页面3、浏览本商品详情页面2-5分钟 4、收藏和加购任务请分开做 5、下单后不要立刻确认收货，等待货物到达后确认"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Editor;
