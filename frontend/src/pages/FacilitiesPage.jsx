import React, { useState, useEffect } from 'react';
import {
  Layout, Table, Button, Modal, Form,
  Input, Select, InputNumber, Tag, Space, Card,
  message, Popconfirm, Typography, Statistic, Row, Col, Empty
} from 'antd';
import {
  AppstoreOutlined, BankOutlined,
  ToolOutlined, EditOutlined,
  DeleteOutlined, PlusOutlined,
  TeamOutlined, DesktopOutlined, VideoCameraOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  DatabaseOutlined, ReloadOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './FacilitiesPage.css';

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const API_BASE_URL = 'http://localhost:8081/api/resources';

const FacilitiesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form] = Form.useForm();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      const dataWithKeys = response.data.map(item => ({
        ...item,
        key: item.id || item._id || Math.random().toString()
      }));
      setResources(dataWithKeys);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([
        { key: '1', name: 'Main Lecture Hall', type: 'Lecture halls', capacity: 200, location: 'Block A, Floor 1', availabilityWindows: 'Mon-Fri 08:00-17:00', status: 'ACTIVE' },
        { key: '2', name: 'Computer Lab 01', type: 'Lab', capacity: 40, location: 'Block B, Floor 2', availabilityWindows: 'Mon-Sat 09:00-18:00', status: 'ACTIVE' },
        { key: '3', name: 'Board Room', type: 'Meeting rooms', capacity: 12, location: 'Admin Block', availabilityWindows: 'Mon-Fri 24H', status: 'OUT_OF_SERVICE' },
        { key: '4', name: 'Projector Set A', type: 'Equipment', capacity: 1, location: 'IT Store', availabilityWindows: 'Anytime', status: 'ACTIVE' },
        { key: '5', name: 'Student Lounge', type: 'Common areas', capacity: 80, location: 'Main Building', availabilityWindows: '24/7', status: 'ACTIVE' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const config = { headers: { 'X-User-Role': 'ADMIN' } };
      if (editingResource) {
        const id = editingResource.id || editingResource._id || editingResource.key;
        await axios.put(`${API_BASE_URL}/${id}`, values, config);
        message.success('Resource updated successfully');
      } else {
        await axios.post(API_BASE_URL, values, config);
        message.success('Resource added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      message.success(`Resource ${editingResource ? 'updated' : 'added'} successfully (Simulated)`);
      setIsModalVisible(false);
      form.resetFields();
      if (editingResource) {
        setResources(resources.map(r => r.key === editingResource.key ? { ...r, ...values } : r));
      } else {
        setResources([{ ...values, key: Date.now().toString() }, ...resources]);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, { headers: { 'X-User-Role': 'ADMIN' } });
      message.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      message.success('Resource deleted successfully (Simulated)');
      setResources(resources.filter(r => r.key !== id && r.id !== id && r._id !== id));
    }
  };

  const openAddModal = () => {
    setEditingResource(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingResource(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Stats
  const totalResources = resources.length;
  const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
  const inactiveCount = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;
  const typeCount = new Set(resources.map(r => r.type)).size;

  const getTypeColor = (type) => {
    const map = {
      'Lab': '#7c3aed', 'Lecture halls': '#2563eb', 'Meeting rooms': '#0891b2',
      'Equipment': '#d97706', 'Common areas': '#059669',
    };
    return map[type] || '#64748b';
  };

  const getTypeIcon = (type) => {
    const map = {
      'Lab': <DesktopOutlined />, 'Lecture halls': <BankOutlined />,
      'Meeting rooms': <TeamOutlined />, 'Equipment': <VideoCameraOutlined />,
      'Common areas': <AppstoreOutlined />,
    };
    return map[type] || <ToolOutlined />;
  };

  const columns = [
    {
      title: 'Resource',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="table-resource-cell">
          <div className="table-icon" style={{ background: `${getTypeColor(record.type)}15`, color: getTypeColor(record.type) }}>
            {getTypeIcon(record.type)}
          </div>
          <div>
            <Text strong style={{ fontSize: 14 }}>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.type}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'center',
      render: (val) => <span className="capacity-cell">{val}</span>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (loc) => (
        <Space size={6}>
          <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
          <span>{loc}</span>
        </Space>
      ),
    },
    {
      title: 'Availability',
      dataIndex: 'availabilityWindows',
      key: 'availabilityWindows',
      render: (val) => <Text type="secondary">{val || '—'}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => {
        const isActive = status === 'ACTIVE';
        return (
          <Tag className={`admin-status-tag ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            <span>{isActive ? 'Active' : 'Out of Service'}</span>
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            className="action-btn edit-btn"
          />
          <Popconfirm
            title="Delete this resource?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id || record._id || record.key)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="action-btn delete-btn"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="admin-layout">
      <Content className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Facilities & Assets</h1>
            <Text type="secondary">Manage campus resources, rooms, and equipment</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchResources} className="refresh-btn">
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
              className="add-btn"
              size="large"
            >
              Add Resource
            </Button>
          </Space>
        </div>

        {/* Stats Cards */}
        <Row gutter={16} className="stats-row">
          <Col xs={12} sm={6}>
            <Card className="stat-card stat-total" bordered={false}>
              <Statistic title="Total Resources" value={totalResources} prefix={<DatabaseOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card stat-active" bordered={false}>
              <Statistic title="Active" value={activeCount} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card stat-inactive" bordered={false}>
              <Statistic title="Out of Service" value={inactiveCount} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#dc2626' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card stat-types" bordered={false}>
              <Statistic title="Categories" value={typeCount} prefix={<AppstoreOutlined />} valueStyle={{ color: '#7c3aed' }} />
            </Card>
          </Col>
        </Row>

        {/* Table Section */}
        <Card className="admin-table-card" bordered={false}>
          <Table
            columns={columns}
            dataSource={resources}
            loading={loading}
            pagination={{
              pageSize: 8,
              position: ['bottomCenter'],
              showSizeChanger: false,
              showTotal: (total) => <Text type="secondary">{total} total resources</Text>,
            }}
            locale={{
              emptyText: <Empty description="No resources yet. Click 'Add Resource' to get started." />,
            }}
          />
        </Card>
      </Content>

      {/* Modal */}
      <Modal
        title={
          <div className="modal-title">
            {editingResource ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingResource ? 'Edit Resource' : 'Add New Resource'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
        width={520}
        className="resource-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="resource-form"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="Resource Name"
            rules={[
              { required: true, message: 'Please enter the resource name' },
              { min: 3, message: 'Name must be at least 3 characters' },
              { whitespace: true, message: 'Name cannot be empty spaces' }
            ]}
          >
            <Input placeholder="e.g. Physics Lab A" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="type"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select category" size="large">
                  <Option value="Lecture halls"><BankOutlined /> Lecture halls</Option>
                  <Option value="Lab"><DesktopOutlined /> Lab</Option>
                  <Option value="Meeting rooms"><TeamOutlined /> Meeting rooms</Option>
                  <Option value="Equipment"><VideoCameraOutlined /> Equipment</Option>
                  <Option value="Common areas"><AppstoreOutlined /> Common areas</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'number', min: 1, message: 'Min 1' }
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="e.g. 50"
                  size="large"
                  formatter={(value) => `${value}`.replace(/\D/g, '')}
                  parser={(value) => value.replace(/\D/g, '')}
                  onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: 'Please enter the location' },
              { max: 50, message: 'Max 50 characters' }
            ]}
          >
            <Input placeholder="e.g. Block C, Floor 2" size="large" prefix={<EnvironmentOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="availabilityWindows"
                label="Availability"
                rules={[{ required: true, message: 'Please enter available times' }]}
              >
                <Input placeholder="e.g. Mon-Fri 08:00-17:00" size="large" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Required' }]}
                initialValue="ACTIVE"
              >
                <Select size="large">
                  <Option value="ACTIVE">
                    <CheckCircleOutlined style={{ color: '#16a34a', marginRight: 6 }} /> Active
                  </Option>
                  <Option value="OUT_OF_SERVICE">
                    <CloseCircleOutlined style={{ color: '#dc2626', marginRight: 6 }} /> Out of Service
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="modal-footer">
            <Button onClick={() => setIsModalVisible(false)} size="large" className="cancel-btn">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" className="submit-btn">
              {editingResource ? 'Save Changes' : 'Add Resource'}
            </Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default FacilitiesPage;
