import React from 'react';
import { Form, Input, Button, Checkbox, Row } from 'antd';

import './index.scss';
import { commonPost } from '@utils/egFetch';
import msg from '@utils/msg'
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
const Register = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
    commonPost('/user/register', { ...values }).then((v) => {
      console.log('onFinish -> v', v);
      if(v.status === "Successful"){ 
        msg.confirm('注册成功，是否跳转到登录？', () => {
          window.location.href = '/member-login'
        })
        
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="loginWrap">
      <div className="loginTit">商户注册</div>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
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
          <Input.Password placeholder="输入密码" />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input placeholder="输入邮箱" />
        </Form.Item>
        <Form.Item label="手机号" name="mobile">
          <Input placeholder="输入手机号" />
        </Form.Item>
        <Form.Item label="联系人姓名" name="showName">
          <Input placeholder="输入联系人姓名" />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Input placeholder="输入类型" />
        </Form.Item>
        <Form.Item
          label="邀请码"
          name="invitationCode"
          rules={[
            {
              required: true,
              message: '请输入邀请码!',
            },
          ]}
        >
          <Input placeholder="输入邀请码" />
        </Form.Item>

        {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Row align="center">
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default Register;
