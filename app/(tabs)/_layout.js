import React from "react";
import { Tabs, router } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

export default function _layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
          headerTitle: "Home",
          headerRight: () => (
            <Pressable onPress={() => router.push("feed/detail")}>
              <Text>toBeRemoved</Text>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
          headerTitle: "Profile",
        }}
      />
    </Tabs>
  );
}
