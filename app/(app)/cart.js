import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CustomCartHeader from "../../components/CustomCartHeader";
import { useRouter } from 'expo-router';

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState([]);


  // fun add to check if book in cart or not , if yes just increase quantity , if not , add and set quantity to 1
//(هل الكتاب اصلا موجود؟ لو اه هتزود واحد ....(لو لا هتضيفه بكمية واحد بالعربي عشان مينا ميزعلش"

const addToCart = (book) => {
  const existingItem = items.find((item) => item.id === book.id);

  if (existingItem) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  } else {
    setItems((prevItems) => [...prevItems, { ...book, quantity: 1 }]);
  }
};


  const handleIncrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleDecrement(item.id)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text>{item.quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleIncrement(item.id)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.price}>${item.price * item.quantity}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomCartHeader router={router}/>
      <Text style={styles.title}>CART</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.additionalInfo}>
        *Shipping charges, taxes, and discount codes are calculated at the time of checkout.
      </Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjusted alignment
    width: 60, // Adjusted width to fit buttons
  },
  button: {
    backgroundColor: '#ca6128',
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  additionalInfo: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: '#ca6128',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
