import React, { useState, useEffect, useMemo } from 'react';
import {
  Input, Checkbox, Slider, Select, Tag, Spin, Typography, message,
  Button, Tooltip, Alert, Empty, Badge
} from 'antd';
import {
  UpOutlined, DownOutlined, EnvironmentOutlined, TeamOutlined,
  DesktopOutlined, VideoCameraOutlined, ToolOutlined, ScheduleOutlined,
  CalendarOutlined, BankOutlined, AppstoreOutlined, FilterOutlined,
  ClearOutlined, SearchOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './FacilityList.css';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const API_BASE_URL = 'http://localhost:8081/api/resources';

// --- Collapsible Filter Section ---
const FilterSection = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-header-left">
          {icon && <span className="filter-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        {isOpen ? <UpOutlined style={{ fontSize: 10 }} /> : <DownOutlined style={{ fontSize: 10 }} />}
      </div>
      <div className={`filter-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const FacilityList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Filter States
  const [searchText, setSearchText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [capacityRange, setCapacityRange] = useState([0, 500]);
  const [capacityCheckboxes, setCapacityCheckboxes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const typeOptions = ['Lecture halls', 'Lab', 'Meeting rooms', 'Equipment', 'Common areas'];
  const capacityOptions = [
    { label: '1 – 20', value: '1-20' },
    { label: '21 – 50', value: '21-50' },
    { label: '51 – 100', value: '50-100' },
    { label: '100+', value: '100+' },
  ];

  // Data Fetching
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      let minCap = capacityRange[0];
      let maxCap = capacityRange[1];
      if (capacityCheckboxes.length > 0) {
        const mins = capacityCheckboxes.map(c => {
          if (c === '1-20') return 1; if (c === '21-50') return 21;
          if (c === '50-100') return 50; if (c === '100+') return 101; return 0;
        });
        const maxs = capacityCheckboxes.map(c => {
          if (c === '1-20') return 20; if (c === '21-50') return 50;
          if (c === '50-100') return 100; if (c === '100+') return 10000; return 10000;
        });
        minCap = Math.min(...mins);
        maxCap = Math.max(...maxs);
      }

      const params = new URLSearchParams();
      if (selectedTypes.length > 0) params.append('type', selectedTypes[0]);
      if (selectedStatus) params.append('status', selectedStatus);
      if (minCap > 0) params.append('minCapacity', minCap);
      if (maxCap < 500) params.append('maxCapacity', maxCap);

      try {
        const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
        setResources(response.data);
        setNetworkError(false);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setNetworkError(true);
        const mockDb = [
          { id: 1, name: 'Main Lecture Hall', type: 'Lecture halls', capacity: 200, location: 'Block A, Floor 1', availabilityWindows: 'Mon-Fri 8AM-6PM', status: 'ACTIVE' },
          { id: 2, name: 'Computer Lab 01', type: 'Lab', capacity: 40, location: 'Block B, Floor 2', availabilityWindows: 'Mon-Sat 9AM-5PM', status: 'ACTIVE' },
          { id: 3, name: 'Board Room', type: 'Meeting rooms', capacity: 12, location: 'Admin Block', availabilityWindows: 'Mon-Fri 9AM-5PM', status: 'OUT_OF_SERVICE' },
          { id: 4, name: 'Projector Set A', type: 'Equipment', capacity: 1, location: 'IT Store', availabilityWindows: 'Anytime', status: 'ACTIVE' },
          { id: 5, name: 'Student Lounge', type: 'Common areas', capacity: 80, location: 'Main Building', availabilityWindows: '24/7', status: 'ACTIVE' },
          { id: 6, name: 'Physics Lab', type: 'Lab', capacity: 35, location: 'Science Block', availabilityWindows: 'Weekdays', status: 'ACTIVE' },
        ];
        const fallback = mockDb.filter(res => {
          let tMatch = selectedTypes.length === 0 || selectedTypes.includes(res.type);
          let sMatch = !selectedStatus || res.status === selectedStatus;
          let cMatch = res.capacity >= minCap && res.capacity <= maxCap;
          return tMatch && sMatch && cMatch;
        });
        setResources(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [selectedTypes, selectedStatus, capacityRange, capacityCheckboxes]);

  const filteredResources = useMemo(() => {
    return resources.filter((res) =>
      res.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [resources, searchText]);

  // Visual Helpers
  const getIcon = (type) => {
    const iconMap = {
      'Lab': <DesktopOutlined />,
      'Lecture halls': <BankOutlined />,
      'Meeting rooms': <TeamOutlined />,
      'Equipment': <VideoCameraOutlined />,
      'Common areas': <AppstoreOutlined />,
    };
    return iconMap[type] || <ToolOutlined />;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      'Lab': '#7c3aed',
      'Lecture halls': '#2563eb',
      'Meeting rooms': '#0891b2',
      'Equipment': '#d97706',
      'Common areas': '#059669',
    };
    return colorMap[type] || '#64748b';
  };

  const activeFiltersCount = selectedTypes.length + capacityCheckboxes.length + (selectedStatus ? 1 : 0);

  const resetFilters = () => {
    setSearchText('');
    setSelectedTypes([]);
    setCapacityRange([0, 500]);
    setCapacityCheckboxes([]);
    setSelectedStatus(undefined);
  };

  return (
    <div className="catalog-layout">
      {/* LEFT SIDEBAR */}
      <aside className="catalog-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title-row">
            <FilterOutlined className="sidebar-title-icon" />
            <h3 className="sidebar-title">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge count={activeFiltersCount} className="filter-badge" />
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={resetFilters}
              className="clear-btn"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="filters-body">
          <FilterSection title="Resource Type" icon={<AppstoreOutlined />}>
            <Checkbox.Group
              value={selectedTypes}
              onChange={setSelectedTypes}
              className="type-checkbox-group"
            >
              {typeOptions.map(type => (
                <Checkbox key={type} value={type} className="type-checkbox">
                  <span className="type-dot" style={{ background: getTypeColor(type) }} />
                  {type}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </FilterSection>

          <FilterSection title="Capacity" icon={<TeamOutlined />}>
            <Slider
              range
              value={capacityRange}
              max={500}
              onChange={setCapacityRange}
              tooltip={{ formatter: (val) => val >= 500 ? '500+' : val }}
              className="capacity-slider"
            />
            <div className="slider-labels">
              <Text type="secondary" style={{ fontSize: 12 }}>{capacityRange[0]}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{capacityRange[1] >= 500 ? '500+' : capacityRange[1]}</Text>
            </div>
            <Checkbox.Group
              value={capacityCheckboxes}
              onChange={setCapacityCheckboxes}
              className="capacity-checkboxes"
            >
              {capacityOptions.map(opt => (
                <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
              ))}
            </Checkbox.Group>
          </FilterSection>

          <FilterSection title="Availability" icon={<ClockCircleOutlined />}>
            <Select
              placeholder="All statuses"
              allowClear
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%' }}
              size="middle"
            >
              <Option value="ACTIVE">
                <Badge status="success" text="Available" />
              </Option>
              <Option value="OUT_OF_SERVICE">
                <Badge status="error" text="Out of Service" />
              </Option>
            </Select>
          </FilterSection>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="catalog-main">
        {networkError && (
          <Alert
            message="Backend not reachable — showing demo data"
            type="warning"
            showIcon
            closable
            className="network-alert"
            onClose={() => setNetworkError(false)}
          />
        )}

        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <h2 className="catalog-title">Campus Resources</h2>
            <Text type="secondary" className="results-count">
              {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
            </Text>
          </div>
          <Search
            placeholder="Search by name..."
            allowClear
            size="large"
            className="catalog-search"
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            onSearch={(val) => setSearchText(val)}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text type="secondary" style={{ marginTop: 16 }}>Loading resources...</Text>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="empty-container">
            <Empty description="No resources match your filters" />
            <Button type="link" onClick={resetFilters}>Clear filters</Button>
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="card-accent" style={{ background: `linear-gradient(135deg, ${getTypeColor(resource.type)}, ${getTypeColor(resource.type)}88)` }} />

                <div className="card-body">
                  <div className="card-top-row">
                    <div className="card-icon-wrapper" style={{ background: `${getTypeColor(resource.type)}15`, color: getTypeColor(resource.type) }}>
                      {getIcon(resource.type)}
                    </div>
                    <Tag
                      className={`status-badge ${resource.status === 'ACTIVE' ? 'active' : 'inactive'}`}
                    >
                      {resource.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                    </Tag>
                  </div>

                  <h4 className="card-name">{resource.name}</h4>
                  <Tag className="type-tag" style={{ color: getTypeColor(resource.type), background: `${getTypeColor(resource.type)}12`, borderColor: `${getTypeColor(resource.type)}30` }}>
                    {resource.type}
                  </Tag>

                  <div className="card-info-grid">
                    <div className="info-item">
                      <EnvironmentOutlined className="info-icon" />
                      <span>{resource.location || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <TeamOutlined className="info-icon" />
                      <span>{resource.capacity} seats</span>
                    </div>
                    <div className="info-item full-width">
                      <ScheduleOutlined className="info-icon" />
                      <span>{resource.availabilityWindows || 'N/A'}</span>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    disabled={resource.status === 'OUT_OF_SERVICE'}
                    onClick={() => message.success(`Booking request sent for "${resource.name}"`)}
                    className="booking-btn"
                    block
                  >
                    {resource.status === 'OUT_OF_SERVICE' ? 'Currently Unavailable' : 'Request Booking'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacilityList;
