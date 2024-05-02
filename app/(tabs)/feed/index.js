import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const firebaseConfig = {
  apiKey: "AIzaSyCB7vyN2k4OtKgLdaQpdRKt9z16nvT-_YU",
  authDomain: "fir-764ee.firebaseapp.com",
  projectId: "fir-764ee",
  storageBucket: "fir-764ee.appspot.com",
  messagingSenderId: "160083899923",
  appId: "1:160083899923:web:3395b1cc936f1b851431e6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function TabOneScreen() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkInternetConnection();
    fetchBooks();
  }, []);
  const checkInternetConnection = async () => {
    const isConnected = await NetInfo.fetch().then(
      (state) => state.isConnected
    );
    if (!isConnected) {
      Alert.alert(
        "No Internet",
        "Please check your internet connection and try again.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  };
  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Books"));
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      await AsyncStorage.setItem("books", JSON.stringify(booksData)); // Save books data in AsyncStorage
      setBooks(booksData);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching books: ", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const handleBookPress = (item) => {
    console.log("Pressed book:", item);
  };

  const addToCart = (item) => {
    Alert.alert("Added to Cart", `${item.name} added to cart.`);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.price.toString().includes(searchQuery) // Convert price to string for comparison
  );

  const sortedBooks = sortBy
    ? filteredBooks.sort((a, b) => {
        if (sortBy === "price") {
          return a[sortBy] - b[sortBy]; // Compare prices directly as numbers
        } else if (a[sortBy] && b[sortBy]) {
          return a[sortBy].toString().localeCompare(b[sortBy].toString());
        } else {
          return 0;
        }
      })
    : filteredBooks;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search "
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <View style={styles.sortContainer}>
        <Text style={{ fontWeight: "bold", marginTop: 15 }}>Sort by:</Text>
        <Pressable
          onPress={() => setSortBy("name")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              margin: 5,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Name</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortBy("price")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              margin: 5,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Price</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortBy("publisher")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              margin: 5,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Publisher</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortBy("genre")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              margin: 5,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Genre</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={sortedBooks}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleBookPress(item)}>
              <View style={styles.bookItem}>
                <Text>name : {item.name}</Text>
                <Text>author : {item.author}</Text>
                <Text>publisher : {item.publisher}</Text>
                <Text>genre : {item.genre}</Text>
                <Text>price : {item.price}</Text>
                <Pressable onPress={() => addToCart(item)}>
                  <Text style={styles.addToCartButton}>Add to Cart</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  bookItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  addToCartButton: {
    marginTop: 10,
    color: "blue",
    fontWeight: "bold",
    textAlign: "center",
  },
});
