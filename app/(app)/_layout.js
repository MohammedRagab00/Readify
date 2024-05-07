import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../components/HomeHeader";
import CustomCartHeader from "../../components/CustomCartHeader";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          header: () => <HomeHeader />,
        }}
      />
        
      {/* <Stack.Screen
        name="ItemDetails"
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack>
  );
}
