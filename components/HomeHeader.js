import { View, Text, Platform } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAnimatedGestureHandler } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blurhash } from '../utilis/common';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useRouter } from 'expo-router';

import { useAuth } from '../context/authContex';
import { MenuItem } from './CustomMenuItems';
const ios =Platform.OS=='ios'
export default function HomeHeader() {
  const router =useRouter();
    const {user,logout}= useAuth();
    const {top}= useSafeAreaInsets();
    const handleProfile =()=>{
      router.push('profile')
    }
    const handleCart =()=>{
     router.push('cart')
    }
    const handleLogOut=async()=>{
      await logout();
    }
  return (
    
    <View style={{paddingTop: ios? top:top+10, backgroundColor:"#ca6128"}} className ="flex-row justify-between px-5 pb-6 rounded-b-3xl shadow"> 
      <View>
        <Text style={{fontSize:hp(4)}} className="font-medium text-white ">BookStack </Text>
      </View>

      <View>
        <Menu>
          <MenuTrigger customStyles={{
            triggerWrapper:{
            
          }}}>
          <FontAwesome name="list" size={24} color="black" style={{paddingTop:10}}/>

          </MenuTrigger>
          <MenuOptions 
          customStyles={{
            optionsContainer:{
              borderRadius:10,
              borderCurve:'continuous',
              marginTop:40,
              marginLeft:-10,
              backgroundColor:'white',
              shadowOpacity:0.2,
              shadowOffset:{width:0,height:0},
              width:190
            }
          }}>
              <MenuItem
                text="Profile"
                action={handleProfile}
                value={null}
                icon={<FontAwesome5 name="user-circle" size={hp(2.5)} color="#737373" />}
              />
              <Divider/>
              <MenuItem
                text="Cart"
                action={handleCart}
                value={null}
                icon={<Feather name="shopping-cart" size={hp(2.5)} color="#737373" />}
              />
              <Divider/>
              <MenuItem
                text="Sign Out"
                action={handleLogOut}
                value={null}
                icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
              />
          </MenuOptions>
        </Menu> 

      </View>
    </View>
  )
}
const Divider =()=>{
  return(
    < View className="p-[1px] w-full bg-neutral-200" /> 

    
  )
}