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
  request_bash_text,
  singleAttack,
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
  const [totalRequestNums, setTotalRequestNums] = useState(5000);
  const [usingThreadsNums, setUsingThreadsNums] = useState(10);
  const [timeConstraint, setTimeConstraint] = useState(5);

  const [singleBtnLoading, setSingleBtnLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  

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
    }, 1000);

    return () => {
      // 组件销毁时清除定时器
      clearInterval(timer);
    }
  }, [])

  // 顶部启停按钮
  const handleSwitchDevicaAll = (isWorking) => {
    switchDeviceAll(isWorking, '').then(res => {
      message.success('操作成功');
    }).catch(err => {
      message.error('操作失败');
      console.log(err);
    });
  }

  // 提交表单
  const handleStartTaskAll = () => {
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
    setTotalRequestNums(5000);
    setUsingThreadsNums(10);
    setTimeConstraint(5);
  }

  // 单次测试目标
  const handleSingleAttack = () => {
    setSingleBtnLoading(true);
    singleAttack(requestBashText).then(res => {
      // 打开一个全局提示框显示响应内容
      setModalContent('单次测试结果|^|状 态 码: ' + res.data.status_code + '|^|响应时间: ' + res.data.delay_time + ' ms|^|响应内容: |^|' + res.data.resp_body)
      setOpenModal(true);
      setSingleBtnLoading(false);
    }).catch(err => {
      message.error('请求发送失败', err);
      setSingleBtnLoading(false);
    })
  }

  return (
    <Router basename="/appa">
      <div className="App">
        <div style={{height: '20px'}}></div>
          <Space direction='horizontal'>
            {/* 顶部控制栏 */}
            <Input value={serverClock} prefix={<ClockCircleOutlined />} className='Top-clock' style={{backgroundColor: connected? 'transparent':'red'}}/>
            <Button type="primary" size='large' onClick={()=>{handleSwitchDevicaAll(true)}}>启动所有设备</Button>
            <Button size='large' onClick={()=>{handleSwitchDevicaAll(false)}}>停止所有设备</Button>
          </Space>
          <div style={{height: '20px'}}></div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '96%', height: '9px', backgroundColor: '#eee', marginBottom: '20px', borderRadius: '50px'}}></div>
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
                  <Button onClick={handleSingleAttack} loading={singleBtnLoading} style={{backgroundColor: '#5f8'}}>单次访问测试</Button>
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

          {/* modal提示框 */}
          <Modal 
            title=""
            footer={
              <Button onClick={()=>{setOpenModal(false)}}>确定</Button>
            }
            open={openModal}
            onCancel={()=>{setOpenModal(false)}}
          >
            <div style={{height: '20px'}}></div>
            <div>
              {modalContent.split('|^|').map((line, index) => {
                if (index===4){
                  return <div key={index} style={{maxHeight: '520px', overflowY: 'auto'}}>{line}</div>
                }else{
                  return <p key={index}>{line}</p>
                }
              })}
            </div>
          </Modal>
      </div>
    </Router>
  );
}

export default App;
