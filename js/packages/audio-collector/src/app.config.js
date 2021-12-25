export default {
  pages: [
    'pages/start/start',
    'pages/index/index',
    'pages/logs/logs',
    'pages/back/back',
    'pages/luck/luck',
    'pages/info/info',
    'pages/info/about/about',
    'pages/info/modify/modify',
    'pages/info/feedback/feedback'
  ],
  window: {
    navigationStyle: 'custom',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Weixin',
    navigationBarTextStyle: 'black'
  },
  sitemapLocation: 'sitemap.json',
  tabBar: {
    color: '#a9b7b7',
    selectedColor: '#11cd6e',
    borderStyle: 'white',
    list: [
      {
        selectedIconPath: 'images/volunteer.png',
        iconPath: 'images/volunteer.png',
        pagePath: 'pages/index/index',
        text: '贡献'
      },
      {
        selectedIconPath: 'images/achievement.png',
        iconPath: 'images/achievement.png',
        pagePath: 'pages/luck/luck',
        text: '成就'
      },
      {
        selectedIconPath: 'images/hired.png',
        iconPath: 'images/hired.png',
        pagePath: 'pages/info/info',
        text: '更多'
      }
    ]
  }
}
