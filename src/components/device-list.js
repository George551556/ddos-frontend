import React from 'react';
import { List, Tag, Progress, Tooltip, Empty, Button, message as messageApi } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  switchDeviceAll,
} from '../service/service'

const DeviceList = ({ data = [], deviceNums = 0, message = '' }) => {
  if (deviceNums === 0 || data.length === 0) {
    return <Empty description="暂无设备" />;
  }

  const handleClickStart = (id) => {
    switchDeviceAll(true, id).then(res => {
      messageApi.success('操作成功');
    }).catch(err => {
      messageApi.error('操作失败');
      console.log('操作失败：', err);
    });
  }

  const handleClickStop = (id) => {
    switchDeviceAll(false, id).then(res => {
      messageApi.success('操作成功');
    }).catch(err => {
      messageApi.error('操作失败');
      console.log('操作失败：', err);
    });
  }

  // 渐变色定义
  const conicColors = {
    '0%': '#87d068',
    '50%': '#ffe58f',
    '100%': '#ff0000',
  };

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
                  />
                </span>
                <span>
                  CPU负载：
                  <Progress type="dashboard" percent={device.total_cpu} strokeColor={conicColors} size={'small'} />
                </span>
                <div style={{height: '40px', width: '5px', backgroundColor: 'gray', borderRadius: '10px', opacity: '0.1'}}> </div>
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
