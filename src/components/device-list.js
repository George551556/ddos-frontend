import React from 'react';
import { List, Tag, Progress, Tooltip, Empty, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const DeviceList = ({ data = [], deviceNums = 0, message = '' }) => {
  if (deviceNums === 0 || data.length === 0) {
    return <Empty description="暂无设备" />;
  }

  const handleClickStart = (id) => {
    console.log('start', id);
  }

  const handleClickStop = (id) => {
    console.log('stop', id);
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(device) => (
        <List.Item
          actions={[
            <Button type='primary' onClick={() => handleClickStart(device.id)}>开始</Button>,
            <Button type='dashed' onClick={() => handleClickStop(device.id)}>停止</Button>,
            <Tooltip
              key="info"
              title={
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(device, null, 2)}
                </pre>
              }
            >
              <InfoCircleOutlined style={{ fontSize: 16 }} />
            </Tooltip>,
          ]}
        >
          <List.Item.Meta
            title={device.name}
            description={
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', fontSize: '16px' }}>
                <Tag color={device.is_working ? 'green' : 'red'}>
                  {device.is_working ? '工作中' : '已停止'}
                </Tag>
                <span>
                  完成度：
                  <Progress
                    type="circle"
                    percent={device.finish_rate}
                    width={50}
                    size="small"
                  />
                </span>
                <span>平均延迟：{device.avg_delay} ms</span>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default DeviceList;
