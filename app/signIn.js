import React, { useRef, useState } from "react";
import { View, Image, Text, TextInput, Pressable, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import Loading from "../components/Loading";
import { login } from "../fireBase/auth"; // Import signInWithEmailAndPassword function
import { resetPass } from "../fireBase/auth"; // Import resetPass function

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign in", "Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      await login(emailRef.current, passwordRef.current);
      setLoading(false);
      console.log("User logged in successfully");
      router.replace("home");
    } catch (error) {
      setLoading(false);
      console.error("Error logging in:", error.message);
      Alert.alert("Sign In", error.message);
    }
  };
  
  const handleForgotPass = async () => {
    try {
      await resetPass(emailRef.current); // Call resetPass function
      Alert.alert("Forgot Password", "Please check your email to reset your password");
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert("Forgot Password", "Error sending password reset email");
    }
  };

  return (
    <CustomKeyBoardView>
      <StatusBar style="dark" />
      <View style={{ paddingTop: 64, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ height: 250, width: 320, resizeMode: "contain" }}
            source={require("../assets/images/login.png")}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#333" }}>
            Sign In
          </Text>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 20, paddingHorizontal: 16, height: 56 }}>
              <Foundation name="mail" size={20} color="gray" style={{marginRight:10}}/>
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: 16, flex: 1, fontWeight: "bold", color: "#333" }}
                placeholder="Email address"
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 20, paddingHorizontal: 16, height: 56 }}>
                <Foundation name="lock" size={20} color="gray" style={{marginRight:10}}/>
                <TextInput
                  onChangeText={(value) => (passwordRef.current = value)}
                  style={{ fontSize: 16, flex: 1, fontWeight: "bold", color: "#333" }}
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                />
              </View>
             
              
            </View>
            <View style={{ marginTop: 20 }}>
              {loading ? (
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Loading size={48} />
                </View>
              ) : (
                <Pressable
                  onPress={handleLogin}
                  style={{ backgroundColor: "#ca6128", borderRadius: 20, height: 56, justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Submit</Text>
                </Pressable>
              
              )}
            </View>
            <Pressable onPress={handleForgotPass}>
                  <Text style={{ fontSize: 14, fontWeight: "bold", color: "#ca6128", textAlign: "right", marginTop: 5 }}>Forgot Password ?</Text>
                </Pressable>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#777" }}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#ca6128" }}>Sign up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
