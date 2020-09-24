import React from 'react';
import { Form, Input, Button, Checkbox, Row } from 'antd';

import './index.scss';

import { commonPostString } from '@utils/egFetch';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const Login = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
    const { password, username } = values;
    const str = `username=${username}&password=${password}`;
    commonPostString('/loginVerify', str).then((v) => {
      console.log('onFinish -> v', v);
      if (v.status === 'Successful') {
        let data = v.data;
        if (data) {
          const [JSESSIONID, type] = data.split('@@');
          console.log('onFinish -> JSESSIONID, type', JSESSIONID, type);
          if (type === '0') {
            console.log('pc登录');
            window.location.href = '/member-center/dashboard';
          }
        }
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="loginWrap">
      <div className="loginTit">商户后台登录</div>
      <Form
        // {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input placeholder="输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input.Password placeholder="输入登录密码" />
        </Form.Item>

        {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Row align="center" justify="center">
          <Button type="primary" htmlType="submit">
            登录
          </Button>
          <span
            className="register"
            onClick={() => {
              window.location.href = '/member-register';
            }}
          >
            注册
          </span>
        </Row>
      </Form>
    </div>
  );
};

export default Login;
