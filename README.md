# 虚拟列表

### 虚拟列表的实现，实际上就是在首屏加载的时候，只加载可视区域内需要的列表项，当滚动发生时，动态通过计算获得可视区域内的列表项，并将非可视区域内存在的列表项删除。

# 核心变量

### 1.通过容器高度和每一条的高度计算视口应该渲染的可以看到的条数（visibleCount）

### 2.计算当前可视区域起始索引位置（start）

### 3.计算当前可视区域结束索引位置（end）

### 4.计算当前可视区域的数据，并渲染到页面中 （visibleData）

### 5.计算 startIndex 对应的数据在整个列表中的偏移位置 startOffset 并设置到列表上 （offset）

```bash
const visibleCount = Math.ceil(containerHeight / itemHeight);

const start = Math.floor(scrollTop / itemHeight);

const end = start + visibleCount;

const visibleData = data.slice(start, Math.min(end, data.length));

const offset = scrollTop - (scrollTop % itemHeight);
```

# 无限滚动

### 滚动时要设置数据的视口，即通过设置 star 的方式间接地设置数据的滑动窗口 当滚动后，由于渲染区域相对于可视区域已经发生了偏移，此时我需要获取一个偏移量 offset，通过样式控制将渲染区域偏移至可视区域中。
