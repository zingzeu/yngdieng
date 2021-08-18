# 关于首页每日一词的词条池

## 对词条池的设想
「每日一词」的预想效果是给来到榕典首页后不知道该搜索什么的用户提供一个随机的词条，从而提供一个探索榕典的入口。因此，理想的词条池应该 1.易懂、不生僻；2.实用、常见，或容易引起兴趣。

## 词条池的生成
目前暂时采取简单粗暴的办法，即从谷歌分析中到处近期用户访问过的网址。

1. [Google Analytics](analytics.google.com) -> Behavior -> Site Content -> All Pages
2. 右下角点击 "view full report"
3. 右上角点击 EXPORT -> CSV 

该文件为.csv格式，形如：

```
Page,Pageviews,Unique Pageviews,Avg. Time on Page,Entrances,Bounce Rate,% Exit,Page Value
/,"3,047",476,00:00:45,346,12.14%,4.79%,$0.00
/search/looyk,4,1,00:00:05,0,0.00%,0.00%,$0.00
/w/CgQ1NjJG,1,1,00:00:18,0,0.00%,0.00%,$0.00
```
每行第一栏即为页面的链接。
从中筛选形为/w/CgQzRkI4（长度为8）的链接。
