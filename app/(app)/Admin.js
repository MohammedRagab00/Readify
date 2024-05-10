import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from "react-native";
// import { db } from "../../fireBase/Config";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  //   const [rate, setRate] = useState(4.56);

  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    const usersRef = collection(db, "Books");

    const querySnapshot = await getDocs(usersRef);
    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    if (name.trim() === "" || price.trim() === "" || imageUrl.trim() === "") {
      //continue
      Alert.alert("Please enter book details");
      return;
    }

    try {
      await addDoc(collection(db, "Books"), {
        name: name,
        price: parseFloat(price),
        imageUrl: imageUrl,
        author: author,
        publisher: publisher,
        genre: genre,
      });
      Alert.alert("Product added successfully");
      setName("");
      setPrice("");
      setImageUrl("");
      setAuthor("");
      setPublisher("");
      setGenre("");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleDeleteProduct = async (bookId) => {
    try {
      await deleteDoc(doc(db, "Books", bookId));
      Alert.alert("Book deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (
      !selectedProduct ||
      name.trim() === "" ||
      price.trim() === "" ||
      imageUrl.trim() === "" ||
      author.trim() === "" ||
      genre.trim() === "" ||
      publisher.trim() === ""
    ) {
      //continue
      Alert.alert("Please select a product and enter details");
      return;
    }

    try {
      const bookId = selectedProduct.id;
      await updateDoc(doc(db, "Books", bookId), {
        name: name,
        price: parseFloat(price),
        imageUrl: imageUrl,
        author: author,
        publisher: publisher,
        genre: genre,
      });
      Alert.alert("Product updated successfully");
      setName("");
      setPrice("");
      setImageUrl("");
      setAuthor("");
      setPublisher("");
      setGenre("");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      router.replace("/signIn");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const openEditModal = (book) => {
    setSelectedProduct(book);
    setName(book.name);
    setPrice(book.price.toString());
    setImageUrl(book.imageUrl);
    setAuthor(book.author);
    setPublisher(book.publisher);
    setGenre(book.genre);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <MaterialCommunityIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedProduct(null);
            setName("");
            setPrice("");
            setImageUrl("");
            setAuthor("");
            setPublisher("");
            setGenre("");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter book name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter book price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter product image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter genre name"
              value={genre}
              onChangeText={setGenre}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter author name"
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter publisher name"
              value={publisher}
              onChangeText={setPublisher}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={selectedProduct ? handleUpdateProduct : handleAddProduct}
            >
              <Text style={styles.buttonText}>
                {selectedProduct ? "Update Product" : "Add Product"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedProduct(null);
                setName("");
                setPrice("");
                setImageUrl("");
                setAuthor("");
                setPublisher("");
                setGenre("");
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
            <View style={styles.bookInfoContainer}>
              <Text style={styles.bookTitle}>{item.name}</Text>
              <Text style={styles.bookDetails}>Author: {item.author}</Text>
              <Text style={styles.bookDetails}>
                Publisher: {item.publisher}
              </Text>
              <Text style={styles.bookDetails}>Genre: {item.genre}</Text>
              <Text style={styles.bookDetails}>Price: {item.price}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteProduct}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleUpdateProduct}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
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
    borderRadius: 8,
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
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: 120,
    height: 190,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  bookInfoContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookDetails: {
    marginBottom: 10,
  },
  addToCartButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ca6128",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  editButton: {
    backgroundColor: "#008000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    minWidth: 300,
    marginHorizontal: 20, // Added margin to the sides
    alignItems: "center", // Centered the content horizontally
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "#DDDDDD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  productItem: {
    padding: 10,
    marginBottom: 10,
  },
  productList: {
    width: "100%",
  },
  productItemOdd: {
    backgroundColor: "#E0E0E0",
  },
  productItemEven: {
    backgroundColor: "#D3D3D3",
  },
  signOutButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginTop: 20,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
