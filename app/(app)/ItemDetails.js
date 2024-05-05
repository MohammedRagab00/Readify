import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ItemDetails() {
  const { item } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!item) return; // Exit early if item is undefined

    const getDetails = async () => {
      try {
        const docRef = doc(db, "Books", item);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data) {
          setName(data.name);
          setPrice(data.price);
          setAuthor(data.author);
        } else {
          setError("No data found for this item.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [item]); // Make sure to re-fetch when item changes

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Name: {name}</Text>
      <Text>Price: {price}</Text>
      <Text>Author: {author}</Text>
    </View>
  );
}
