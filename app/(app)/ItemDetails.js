import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import CustomItemHeader from "../../components/CustomItemHeader";
import { addToCart } from "../../fireBase/fireStoreFunctions";
import { useRouter } from 'expo-router';

export default function ItemDetails() {
  const { item } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (!item) return;

    const fetchBookDetails = async () => {
      try {
        const docRef = doc(db, "Books", item);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data) {
          setBook(data);
        } else {
          setError("No data found for this item.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [item]);

  const handleAddToCart = async () => {
    try {
      await addToCart(book);
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
    }
  };

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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer} key={item.id}>
        <Image style={styles.image} source={{ uri: item.imageUrl }} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.text}>Author: {item.author}</Text>
          <Text style={styles.text}>Publisher: {item.publisher}</Text>
          <Text style={styles.text}>Genre: {item.genre}</Text>
          <Text style={styles.text}>Rate: {item.rate} out of 5 stars</Text>
          <Text style={styles.text}>Price: {item.price} EGP</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomItemHeader router={router} />
      <FlatList
        data={[book]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
            },
          ]}
        >
          <Text style={styles.buttonText}>+ Add To Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 10,
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
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 100,
    height: 150,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 3,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
});
