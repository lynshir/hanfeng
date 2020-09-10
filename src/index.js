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
import FinanceRouter from './pages/Finance/index';
import AccountRouter from './pages/Account/index';

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
              defaultOpenKeys={['accountManage']}
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
                <Menu.Item key="taskReview">
                  <NavLink to="/member-center/taskReview">任务审核</NavLink>
                </Menu.Item>
                <Menu.Item key="commentTask">
                  <NavLink to="/member-center/commentTask">评论任务</NavLink>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="finance" icon={<ContainerOutlined />} title="财务管理">
                <Menu.Item key="recharge">
                  <NavLink to="/member-center/recharge">充值</NavLink>
                </Menu.Item>
                <Menu.Item key="withdraw">
                  <NavLink to="/member-center/withdraw">提现</NavLink>
                </Menu.Item>
                <Menu.Item key="fd">
                  <NavLink to="/member-center/fundingDetail">资金明细</NavLink>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="accountManage" icon={<ContainerOutlined />} title="账户管理">
                <Menu.Item key="shop">
                  <NavLink to="/member-center/shop">店铺管理</NavLink>
                </Menu.Item>
                <Menu.Item key="account">
                  <NavLink to="/member-center/accountNo">账号管理</NavLink>
                </Menu.Item>
                <Menu.Item key="workOrder">
                  <NavLink to="/member-center/workOrder">客服订单</NavLink>
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
              <Switch>
                <FinanceRouter />
              </Switch>
              <Switch>
                <AccountRouter />
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
