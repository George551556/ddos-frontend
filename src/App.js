import { useEffect, useState } from 'react';
import './App.css';
import { Ping, queryServerClock } from './service/service';
import { Input, Button, Select, Space, message, Modal, Col, Row, Spin, } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
function App() {
  const [serverClock, setServerClock] = useState('xx:xx:xx');
  

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

    }, 1000);

    return () => {
      // 组件销毁时清除定时器
      clearInterval(timer);
    }
  }, [])

  return (
    <div className="App">
      <div style={{height: '10px'}}></div>
        <Space direction='horizontal'>
          <p>顶部控制栏</p>
          <Input value={serverClock} prefix={<ClockCircleOutlined />} style={{width: '105px'}}/>
          <Button type="primary" size='large'>Primary</Button>
          <Button size='large'>Default</Button>
        </Space>
        <div style={{height: '20px'}}></div>
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
            <Space direction='vertical' align='center'>
              <div>
                <Spin size='large'></Spin>
                <div style={{color: 'blue', marginTop: '2px'}}>loading...</div>
              </div>
            </Space>
          </Col>
        </Row>
    </div>
  );
}

export default App;
