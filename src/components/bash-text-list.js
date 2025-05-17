import { useEffect, useRef, useState } from 'react';
import { Card, Spin, message, Input, Button } from 'antd';
import { getPaginatedRecords } from '../service/service';
import './this.css';

const { TextArea } = Input;

function HorizontalScroller({ props }) {
  const [setshowHorizonScroller, setRequestBashAbstract, setRequestBashText] = props;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() =>{
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });


    return () => el.removeEventListener('wheel', onWheel);
  }, [])

  useEffect(() => {
    loadData(page);
  }, [page]);

  const loadData = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getPaginatedRecords(pageNum, 4); // 每页4项
      const newData = res.data.data;
    //   console.log('newdat: ', newData);
      setData(prev => [...prev, ...newData]);
      if (newData.total_nums < 4) setHasMore(false); // 没有更多了
    } catch (err) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理滚动事件
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      // 滚动到接近最右边
      if (hasMore) {
        setPage(p => p + 1);
      }
    }
  };

  const handleClickCard = (abstract, bashText) => {
    setRequestBashAbstract(abstract);
    setRequestBashText(bashText);
    setshowHorizonScroller(false);
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{
        display: 'flex',
        height: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: '10px',
        gap: '10px',
      }}
      className='hide-scrollbar'
    >
      {data.map(item => (
        <div
          key={item.ID}
          style={{
            flex: '0 0 20%',
            minWidth: '380px',
            boxSizing: 'border-box',
          }}
        >
          <Card title={item.Abstract} style={{height: '100%'}}>
            <Button onClick={()=>{handleClickCard(item.Abstract, item.BashText)}} style={{position:'absolute', zIndex:'1001', top:1, left:1}} type='primary'>应用</Button>
            <TextArea rows={22} value={item.BashText} />
          </Card>
        </div>
      ))}
      {loading && (
        <div style={{ flex: '0 0 auto', padding: '20px' }}>
          <Spin />
        </div>
      )}
    </div>
  );
}

export default HorizontalScroller;
