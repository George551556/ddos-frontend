import { useEffect, useState } from 'react';
import './App.css';
import DeviceList from './components/device-list';
import {
  Ping,
  queryServerClock,
  queryDevices,
} from './service/service';
import { Input, Button, Select, Space, message, Modal, Col, Row, Spin, } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
function App() {
  const [serverClock, setServerClock] = useState('xx:xx:xx');
  const [devices, setDevices] = useState([]);
  const [deviceNums, setDeviceNums] = useState(0);
  

  // 页面加载后获取数据等操作
  useEffect(() => {
    Ping().then(res => {
      console.log(res.status, res.data);
    }).catch(err => {
      console.log(err);
    });

    const timer = setInterval(() => {
      queryServerClock().then(res => {
        setServerClock(res.data.message);
      }).catch(err => {
        console.log(err);
      });
    }, 2000);

    // 获取设备列表
    queryDevices().then(res => {
      setDevices(res.data.data);
      setDeviceNums(res.data.deviceNums);
    })

    return () => {
      // 组件销毁时清除定时器
      clearInterval(timer);
    }
  }, [])

  return (
    <div className="App">
      <div style={{height: '10px'}}></div>
        <Space direction='horizontal'>
          {/* 顶部控制栏 */}
          <Input value={serverClock} prefix={<ClockCircleOutlined />} className='Top-clock'/>
          <Button type="primary" size='large'>Primary</Button>
          <Button size='large'>Default</Button>
        </Space>
        <div style={{height: '50px'}}></div>
        <Row>
          {/* 左下 控制表单 */}
          <Col span={1}></Col>
          <Col span={8} style={{}}>
            <div className='Left_bottom_container'>
              <TextArea rows={6} placeholder='request url and body (bash)' />
              <Input placeholder='total request nums' />
              <Input placeholder='parallel requests'/>
              <Input placeholder='time constraint'/>
              <Button >按钮</Button>
              <Button >按钮</Button>

            </div>
          </Col>

          {/* 右下 设备列表 */}
          <Col span={14} style={{}}>
            <div>
              <DeviceList data={devices} deviceNums={deviceNums} />
            </div>
          </Col>
        </Row>
    </div>
  );
}

export default App;
