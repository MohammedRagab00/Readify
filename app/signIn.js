import { View, Image, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/authContex";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign in", "Please fill all the fields");
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    console.log("re", response);
    if (!response.success) {
      Alert.alert("Sign In", response.msg);
      return;
    }
    router.replace("home");
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
              <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "right", color: "#555", marginTop: 10 }}>Forgot Password?</Text>
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
