import React, {useState} from 'react';
import Taro, {useRouter} from '@tarojs/taro';
import {getCurrentInstance} from '@tarojs/taro';
import {View, Block, Image, Text} from '@tarojs/components';
import {AtIcon, AtDrawer} from 'taro-ui';
import routes from '@/routes';
import logoURL from '@/assets/logo.png';
import styles from './header.module.scss';

interface MenuItem {
  title: string;
  iconType: string;
  navigateToRoute: string;
}

const menuItems: Array<MenuItem> = [
  {
    title: '首页',
    iconType: 'home',
    navigateToRoute: routes.INDEX,
  },
  {
    title: '搜索',
    iconType: 'search',
    navigateToRoute: routes.SEARCH,
  },
  {
    title: '关于',
    iconType: 'alert-circle',
    navigateToRoute: routes.ABOUT,
  },
];

const Header = ({injectedComponents = <Block />}) => {
  const router = useRouter();
  const routePath = router.path || '';
  const [showSidebar, toggleSidebar] = useState(false);

  const navigateTo = routePath => {
    Taro.redirectTo({
      url: routePath,
    });
  };

  return (
    <Block>
      <View className={styles.headerPlaceholder} />
      <View id="header" className={styles.header}>
        {[
          routes.INDEX,
          routes.SEARCH,
          routes.WORD_DETAIL,
          routes.COLLECTION_DETAIL,
        ].includes(routePath) && (
          <View>
            <AtIcon value="menu" onClick={() => toggleSidebar(true)}></AtIcon>
          </View>
        )}
        {[routes.INDEX, routes.WORD_DETAIL, routes.COLLECTION_DETAIL].includes(
          routePath
        ) && (
          <View>
            <Image className={styles.logo} mode="heightFix" src={logoURL} />
          </View>
        )}
        {[routes.INDEX, routes.WORD_DETAIL, routes.COLLECTION_DETAIL].includes(
          routePath
        ) && (
          <View onClick={() => navigateTo(routes.SEARCH)}>
            <AtIcon value="search"></AtIcon>
          </View>
        )}
        {injectedComponents}
      </View>
      <AtDrawer show={showSidebar} onClose={() => toggleSidebar(false)} mask>
        <View id="sidebar_container" className={styles.sidebarContainer}>
          <View className={styles.header}>
            <AtIcon value="close" onClick={() => toggleSidebar(false)}></AtIcon>
          </View>
          <View className={styles.content}>
            <View className={styles.title}>榕典</View>
            <View>
              {menuItems.map(menuItem => (
                <View
                  className={styles.menuItem}
                  key={menuItem.title}
                  onClick={() => navigateTo(menuItem.navigateToRoute)}
                >
                  <AtIcon value={menuItem.iconType}></AtIcon>
                  <Text className={styles.text}>{menuItem.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </AtDrawer>
    </Block>
  );
};

export default Header;
