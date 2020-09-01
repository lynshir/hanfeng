import React, { Component } from 'react'
import { Spin } from 'antd'
import { observer } from 'mobx-react'

const container = {
  textAlign: 'center',
  background:' rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  lineHeight: '100vh'
}

@observer
class Load extends Component {
  render() {
    const { loading } = this.props
    return(
      <div style={{textAlign: 'center',
          background:' rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          lineHeight: '100vh',
          display: loading ? 'block' : 'none'
      }}>
        <Spin size="large" tip="Loading..." spinning={loading} />
      </div>
    )
  }
}

export default Load
