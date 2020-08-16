import React, { useEffect } from 'react'
import { View } from '@tarojs/components'

import 'taro-ui/dist/style/index.scss'

import Header from "@/pages/header/header";

import './index.scss'

const Index = () => {

  useEffect(() => {
    console.log("mounted")
  }, [])
  return (
    <View className='index'>
      <Header />

    </View>
  );
}


export default Index

