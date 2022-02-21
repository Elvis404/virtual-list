import "./App.css";
import Faker from "faker";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

const itemHeight = 100;
const total = 1000000;

export default function App() {
  const ref = useRef();

  // 可视区域高度
  const containerHeight = document.body.clientHeight;
  // 可显示的列表项数
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const [listData, setListData] = useState([]);
  // 偏移量
  const [startOffset, setStartOffset] = useState(0);
  // 起始索引
  const [start, setStart] = useState(0);
  // 结束索引
  const end = start + visibleCount;

  // 列表总高度
  const listHeight = useMemo(() => {
    return listData.length * itemHeight;
  }, [listData]);

  // 获取真实显示列表数据
  const visibleData = useMemo(() => {
    return listData.slice(start, Math.min(end, listData.length));
  }, [listData, start, end]);

  //加载随机数据
  const getTenListData = useCallback(() => {
    if (listData.length >= total) {
      return [];
    }
    return new Array(10).fill({}).map((item) => ({
      id: Faker.datatype.uuid(),
      avatar: Faker.image.avatar(),
      title: Faker.name.firstName(),
      content: Faker.company.companyName(),
    }));
  }, [listData]);

  useEffect(() => {
    const data = getTenListData();
    setListData(data);
  }, []);

  const scrollToTop = () => {
    ref.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const scrollEvent = useCallback(
    (e) => {
      // 当前滚动位置
      const scrollTop = ref.current.scrollTop;
      // 此时的开始索引
      const start = Math.floor(scrollTop / itemHeight);
      const end = start + visibleCount;
      setStart(start);
      if (end >= listData.length) {
        const data = listData.concat(getTenListData());
        setListData(data);
      }
      // 此时的偏移量
      const offset = scrollTop - (scrollTop % itemHeight);
      setStartOffset(offset);
    },
    [listData, getTenListData, visibleCount]
  );

  useEffect(() => {
    let dom = ref.current;
    scrollEvent();
    if (dom) {
      dom.addEventListener("scroll", scrollEvent);
    }
    return () => {
      if (dom) {
        dom.removeEventListener("scroll", scrollEvent);
      }
    };
  }, [scrollEvent]);

  return (
    <div className="infinite-list-container" ref={ref}>
      <div className="scrollTopBtn" onClick={scrollToTop}>
        ∧
      </div>

      <div
        className="infinite-list-phantom"
        style={{ height: Math.max(listHeight, containerHeight + 1) }}
      />
      <div
        className="infinite-list"
        style={{ transform: `translate3d(0,${startOffset}px,0)` }}
      >
        {visibleData.map((item) => (
          <div
            className="infinite-list-item"
            key={item.id}
            style={{ height: itemHeight }}
          >
            <div
              className="left-section"
              style={{ backgroundImage: `url(${item.avatar})` }}
            ></div>
            <div className="right-section">
              <div className="title">{item.title}</div>
              <div className="desc">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
