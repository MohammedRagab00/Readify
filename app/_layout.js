import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3F0488",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
        }}
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
