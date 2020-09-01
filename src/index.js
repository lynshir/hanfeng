import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import { Layout, Menu, ConfigProvider, Icon, Result, Button } from 'antd';
import { DashboardOutlined, ContainerOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
import * as serviceWorker from './serviceWorker';
import './assets/font-awesome/css/font-awesome.min.css';
import './assets/font/style.css';
import './index.css';
import Dashboard from './pages/Dashboard';
import TaskManageRouter from './pages/TaskManage/index';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {
  const [collapsed, onCollapse] = useState(false);
  let pathname = window.location.pathname.replace('/member-center/', '');
  pathname = pathname === '/' || pathname === '/member-center' ? '' : pathname;
  return (
    <Router>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header className="header">
          <div className="clf">测试店铺名称</div>
        </Header>
        <Layout>
          <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={() => {
              onCollapse(!collapsed);
            }}
            style={{ maxHeight: '100vh', overflow: 'hidden' }}
          >
            <Menu
              theme="light"
              defaultOpenKeys={['taskManage']}
              defaultSelectedKeys={[pathname || 'dashboard']}
              mode="inline"
            >
              <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                <NavLink to="/member-center/dashboard">Dashboard</NavLink>
              </Menu.Item>
              <SubMenu key="taskManage" icon={<ContainerOutlined />} title="任务管理">
                <Menu.Item key="relTask">
                  <NavLink to="/member-center/relTask">发布任务</NavLink>
                </Menu.Item>
                <Menu.Item key="taskList">
                  <NavLink to="/member-center/taskList">任务列表</NavLink>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout className="content-wrapper">
            <Content>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/member-center/dashboard" component={Dashboard} />
              <Switch>
                {/* <Route exact path='/' component={ProductDetail}></Route> */}
                <TaskManageRouter />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

ReactDOM.render(
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
