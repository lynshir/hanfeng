import { message, Modal } from 'antd'

const msg = {
  confirm: function (content = '确认操作吗？', okFn = () => { }, options = {}) {
    const { okText = '确认', cancelText = '取消' } = options
    Modal.confirm({
      centered: true,
      content,
      okText,
      cancelText,
      onOk: function () {
        okFn()
      }
    })
  },
  ok: function (text = '操作成功！', duration = 3, onClose = () => { }) {
    message.success(text, duration, onClose)
  },
  error: function (text = '操作失败！', duration = 3, onClose = () => { }) {
    message.error(text, duration, onClose)
  },

}

export default msg