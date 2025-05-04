import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DeviceList from './components/device-list';
import {
  Ping,
  queryServerClock,
  queryDevices,
  startTaskAll,
  switchDeviceAll,
  getDefaultRequestBashText,
} from './service/service';
import { Input, Button, Select, Space, message, Modal, Col, Row, Spin, } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
function App() {
  const [serverClock, setServerClock] = useState('无连接');
  const [connected, setConnected] = useState(false); // 是否能访问后端服务
  const [devices, setDevices] = useState([]);
  const [deviceNums, setDeviceNums] = useState(0);
  const [requestBashText, setRequestBashText] = useState('');
  const [totalRequestNums, setTotalRequestNums] = useState(1000);
  const [usingThreadsNums, setUsingThreadsNums] = useState(5);
  const [timeConstraint, setTimeConstraint] = useState(2);
  

  // 页面加载后获取数据等操作
  useEffect(() => {
    Ping().then(res => {
      console.log(res.status, res.data);
    }).catch(err => {
      console.log(err);
    });

    getDefaultRequestBashText().then(res => {
      setRequestBashText(res.data.data);
    }).catch(err => {
      console.log(err);
    });

    const timer = setInterval(() => {
      queryServerClock().then(res => {
        setServerClock(res.data.message);
        setConnected(true);
      }).catch(err => {
        setServerClock('无连接');
        setConnected(false);
        console.log(err);
      });

      // 获取设备列表
      queryDevices().then(res => {
        setDevices(res.data.data);
        setDeviceNums(res.data.deviceNums);
      }).catch(err => {
        console.log(err);
      });
    }, 2000);

    return () => {
      // 组件销毁时清除定时器
      clearInterval(timer);
    }
  }, [])

  // 提交表单
  const handleStartTaskAll = () => {
    message.info('请求发送中...')
    startTaskAll(requestBashText, totalRequestNums, usingThreadsNums, timeConstraint).then(res => {
      message.success('请求发送成功');
    }).catch(err => {
      message.error('请求发送失败');
      console.log(err);
    });
  }

  // 重置表单
  const handleBtnClear = () => {
    // setRequestBashText('');
    getDefaultRequestBashText().then(res => {
      setRequestBashText(res.data.data);
    }).catch(err => {
      console.log(err);
    });
    setTotalRequestNums(1000);
    setUsingThreadsNums(5);
    setTimeConstraint(2);
  }

  return (
    <Router basename="/appa">
      <div className="App">
        <div style={{height: '20px'}}></div>
          <Space direction='horizontal'>
            {/* 顶部控制栏 */}
            <Input value={serverClock} prefix={<ClockCircleOutlined />} className='Top-clock' style={{backgroundColor: connected? 'transparent':'red'}}/>
            <Button type="primary" size='large' onClick={() => {switchDeviceAll(true, '')}}>启动所有设备</Button>
            <Button size='large' onClick={() => {switchDeviceAll(false, '')}}>停止所有设备</Button>
          </Space>
          <div style={{height: '20px'}}></div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '96%', height: '5px', backgroundColor: '#eee', marginBottom: '20px'}}></div>
          </div>
          <Row>
            {/* 左下 控制表单 */}
            <Col span={1}></Col>
            <Col span={9} style={{}}>
              <div className='Left_bottom_container'>
                <TextArea rows={18} placeholder='request url and body (bash)' value={requestBashText} onChange={(e) => {setRequestBashText(e.target.value)}} allowClear />
                <Input prefix='总请求数量: ' value={totalRequestNums} onChange={(e) => {setTotalRequestNums(e.target.value)}} type='number' />
                <Input prefix='并发请求数: ' value={usingThreadsNums} onChange={(e) => {setUsingThreadsNums(e.target.value)}} type='number' />
                <Input prefix='时间限制: ' value={timeConstraint} onChange={(e) => {setTimeConstraint(e.target.value)}} suffix='分钟' type='number' />
                <Space direction='horizontal'>
                  <Button type='primary' onClick={handleStartTaskAll} >提交</Button>
                  <Button onClick={handleBtnClear} >重置</Button>
                </Space>

              </div>
            </Col>

            {/* 右下 设备列表 */}
            <Col span={13} style={{}}>
              <div>
                <DeviceList data={devices} deviceNums={deviceNums} />
              </div>
            </Col>
          </Row>
      </div>
    </Router>
  );
}

export default App;
