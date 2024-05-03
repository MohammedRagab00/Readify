import { View, Image, Text, TextInput, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Foundation } from '@expo/vector-icons';
import Loading from '../components/Loading';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyBoardView from '../components/CustomKeyBoardView';
import { useAuth } from '../context/authContex';
export default function SignUp() {
    const router =useRouter();
    const{register}=useAuth();
    const [loading,setLoading] = useState(false);
    const emailRef=useRef("");
    const passwordRef=useRef("");
    const usernameRef=useRef("");

    const handleRegister = async ()=>{
        if(!emailRef.current|| !passwordRef.current||!usernameRef.current){
            Alert.alert('Sign up',"Please fill all the fields");
            return;
        }
        setLoading(true);
        let response =await register(emailRef.current,passwordRef.current,usernameRef.current);
        setLoading(false);
        console.log('got result:',response);
        if(!response.success){
            Alert.alert('Sign Up',response.msg);

        }
    }
    return (
        <CustomKeyBoardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                { }
                <View className="item-center">
                    <Image style={{ height: hp(20), width: wp(20), resizeMode: 'contain' }} source={require('../assets/images/register-1.png')} />
                </View>
                <View className="gap-10">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800 ">
                        Sign up
                    </Text>
                    { }
                    <View className="gap-4">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            <FontAwesome name="user" size={hp(2.6)} color="gray" />
                            <TextInput
                                onChangeText={value=>usernameRef.current=value}
                                style={{ fontSize: hp(2) }}
                                className="flex=-1 font-bold text-neutral-700"
                                placeholder='Username'
                                placeholderTextColor={'gray'} />
                        </View>
                            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            <Foundation name="mail" size={hp(2.6)} color="gray" />
                            <TextInput
                                onChangeText={value=>emailRef.current=value}
                                style={{ fontSize: hp(2) }}
                                className="flex=-1 font-bold text-neutral-700"
                                placeholder='Email address'
                                placeholderTextColor={'gray'} />
                        </View>
                      
                            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                                <Foundation name="lock" size={hp(2.6)} color="gray" />
                                <TextInput
                                    onChangeText={value=>passwordRef.current=value}
                                    style={{ fontSize: hp(2) }}
                                    secureTextEntry
                                    className="flex=-1 font-bold text-neutral-700"
                                    placeholder='Password'
                                    placeholderTextColor={'gray'} />
                            </View>


                        <View>
                            {
                                loading?(
                                    <View className="flex-row justify-center">
                                       < Loading size ={hp(8)}/>
                                    </View>
                                ):(
                                     <Pressable onPress={handleRegister} style={{height:hp(6.4),backgroundColor:"#ca6128"}} className=" rounded-xl justify-center items-center">
                            <Text style={{fontSize: hp(2.9)}} className="text-white tracking-wider ">
                                Sign Up
                                </Text>
                        </Pressable>)
                            }
                        </View>
                       
                        <View className="flex-row justify-center">
                            <Text style={{fontSize: hp(1.8)}}className="font-bold text-neutral-500">Already have an account? </Text>
                            <Pressable onPress={()=>router.push('signIn')} >
                                <Text style={{fontSize: hp(1.8),color:"#ca6128"}}className="font-bold ">
                                     Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyBoardView>
    )
}
