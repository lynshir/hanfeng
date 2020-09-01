//来将不留姓名
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col } from 'antd';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';

const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
};

BraftEditor.use(Table(options));

@observer
class Editor extends React.Component {
  render() {
    const {
      store: { editorState, handleEditorChange, clearContent, showImgUpload },
      noTitle,
    } = this.props;
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
              // onSave={submitContent} 在编辑器获得焦点时按下ctrl+s会执行此方法,编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
              excludeControls={excludeControls} //排除的组件
              extendControls={extendControls} //额外的扩展
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Editor;
