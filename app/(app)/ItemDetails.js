import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ItemDetails() {
  const { item } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [rate, setRate] = useState(4.56);

  const handleAddToChart = (item) => {
    console.log("added");
  };

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
          setImageUrl(data.imageUrl);
          setPublisher(data.publisher);
          setGenre(data.genre);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.text, { fontSize: 27 }]}>Book's Name: {name}</Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Written by {author}
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Rate: {rate} out of 5 stars
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Published by {publisher}
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Genre: {genre}
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Price: {price} <Text style={{ fontSize: 13, fontWeight: "500" }}>EGP</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => handleAddToChart(item.id)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>+ Add To Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
  imageContainer: {
    height: "63%",
    borderColor: "#874f1f",
    borderWidth: 8,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
