import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import {
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loading from "../../components/Loading";
import { db } from "../../firebaseConfig";
import { Image } from "expo-image";
import { Route } from "expo-router/build/Route";
import { router } from "expo-router";

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
    router.push(`ItemDetails?item=${item}`);
    // router.push("ItemDetails", { id: itemId });
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
        <Text style={{ fontWeight: "bold", marginTop: hp("1.5%") }}>
          Sort by:
        </Text>

        <Pressable
          onPress={() => setSortBy("name")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: hp("1%"),
              marginVertical: hp("1%"),
              marginHorizontal: wp("1%"),
              borderRadius: wp("2%"),
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
              padding: hp("1%"),
              marginVertical: hp("1%"),
              marginHorizontal: wp("1%"),
              borderRadius: wp("2%"),
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
              padding: hp("1%"),
              marginVertical: hp("1%"),
              marginHorizontal: wp("1%"),
              borderRadius: wp("2%"),
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
              padding: hp("1%"),
              marginVertical: hp("1%"),
              marginHorizontal: wp("1%"),
              borderRadius: wp("2%"),
            },
          ]}
        >
          <Text style={{ color: "white" }}>Genre</Text>
        </Pressable>
      </View>
      {loading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Loading size={hp(8)} />
        </View>
      ) : (
        <FlatList
          data={sortedBooks}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleBookPress(item.id)}>
              <View style={styles.bookItem}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.bookImage}
                />
                <View style={styles.bookInfoContainer}>
                  <Text style={styles.bookTitle}>{item.name}</Text>
                  <Text style={styles.bookDetails}>Author: {item.author}</Text>
                  <Text style={styles.bookDetails}>
                    Publisher: {item.publisher}
                  </Text>
                  <Text style={styles.bookDetails}>Genre: {item.genre}</Text>
                  <Text style={styles.bookDetails}>Price: {item.price}</Text>
                  <Pressable
                    onPress={() => addToCart(item)}
                    style={styles.addToCartButton}
                  >
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                  </Pressable>
                </View>
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
    padding: wp("5%"),
    backgroundColor: "#fff",
  },
  searchInput: {
    height: hp("5%"),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: hp("1%"),
    paddingHorizontal: wp("2%"),
    borderRadius: wp("4%"),
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: hp("1%"),
  },
  bookItem: {
    marginBottom: hp("1%"),
    borderWidth: 1,
    borderColor: "#ccc",
    padding: wp("2%"),
    borderRadius: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: wp("30%"),
    height: hp("20%"),
    marginRight: wp("2%"),
    borderRadius: wp("4%"),
  },
  bookInfoContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: hp("2.2%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  bookDetails: {
    marginBottom: hp("1%"),
  },
  addToCartButton: {
    marginTop: hp("1%"),
    padding: hp("1%"),
    backgroundColor: "#ca6128",
    borderRadius: wp("4%"),
    alignSelf: "flex-start",
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
