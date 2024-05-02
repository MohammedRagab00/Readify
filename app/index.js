import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>Welcome</Text>

      <Link href={"/(tabs)/feed"} asChild>
        <Pressable style={{ backgroundColor: "#0ff" }}>
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            Go To Our Book Store
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
