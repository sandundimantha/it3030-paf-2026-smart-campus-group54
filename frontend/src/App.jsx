import React, { useState } from 'react';
import { Layout, Button, Avatar, Space, Typography, Dropdown } from 'antd';
import {
  UserOutlined, CrownOutlined, SwapOutlined,
  BankOutlined
} from '@ant-design/icons';
import FacilitiesPage from './pages/FacilitiesPage';
import FacilityList from './pages/FacilityList';
import './App.css';

const { Header } = Layout;
const { Text } = Typography;

function App() {
  const [currentView, setCurrentView] = useState('USER');

  const roleItems = [
    {
      key: 'USER',
      label: 'Student View',
      icon: <UserOutlined />,
    },
    {
      key: 'ADMIN',
      label: 'Admin Dashboard',
      icon: <CrownOutlined />,
    },
  ];

  return (
    <div className="App">
      <Header className="app-header">
        <div className="header-left">
          <div className="header-logo">
            <BankOutlined className="logo-icon" />
            <span className="logo-text">Smart Campus</span>
          </div>
          <div className="header-divider" />
          <Text className="header-module">Facilities & Assets</Text>
        </div>

        <div className="header-right">
          <Dropdown
            menu={{
              items: roleItems,
              onClick: ({ key }) => setCurrentView(key),
              selectable: true,
              selectedKeys: [currentView],
            }}
            trigger={['click']}
          >
            <Button className="role-switcher-btn">
              <Space>
                <Avatar
                  size={28}
                  icon={currentView === 'ADMIN' ? <CrownOutlined /> : <UserOutlined />}
                  className={currentView === 'ADMIN' ? 'avatar-admin' : 'avatar-student'}
                />
                <span className="role-label">
                  {currentView === 'ADMIN' ? 'Admin' : 'Student'}
                </span>
                <SwapOutlined className="swap-icon" />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Header>

      <div className="app-content">
        {currentView === 'ADMIN' ? <FacilitiesPage /> : <FacilityList />}
      </div>
    </div>
  );
}

export default App;
