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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
    <SafeAreaView style={styles.container}>
      <View style={{ height: "63%", borderColor: "#874f1f", borderWidth: 8 }}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
      </View>
      <View>
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
          Price: {price}
          <Text style={{ fontSize: 13, fontWeight: "500" }}>EGP</Text>
        </Text>
      </View>
      <View style={styles.button}>
        <Pressable
          onPress={() => handleAddToChart(item.id)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: hp("1%"),
              marginVertical: hp("1%"),
              marginHorizontal: wp("1%"),
              borderRadius: wp("2%"),
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
    // backgroundColor: "#f5b596",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    // backgroundColor: "#",
  },
  text: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontSize: 17,
    fontWeight: "500",
    // color: "#fff",
  },
});
