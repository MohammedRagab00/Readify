import { collection, getDoc, addDoc, doc } from 'firebase/firestore';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import CustomProfileHeader from '../../components/CustomProfileHeader';
import { useRouter } from 'expo-router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { auth } from '../../firebaseConfig';

const ProfilePage = () => {
  const [photo, setPhoto] = useState(null);
  const [uEmail, setUEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setBookName] = useState('');
  const [price, setPrice] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');

  const router = useRouter();
  const user = auth.currentUser;
  useEffect(() => {
    fetchData();
    fetchPhoto();
  }, []);

  const fetchData = async () => {
    try {
      const userId = user.uid;
      const userDocRef = doc(db, 'users', userId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userEmail = userData.email;
        const userName = userData.name;
        setUEmail(userEmail);
        setUserName(userName);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchPhoto = async () => {
    try {
      const storedPhoto = await AsyncStorage.getItem('profilePhoto');
      if (storedPhoto) {
        setPhoto(storedPhoto);
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
    }
  };

  const savePhoto = async (photoUri) => {
    try {
      await AsyncStorage.setItem('profilePhoto', photoUri);
    } catch (error) {
      console.error('Error saving photo:', error.message);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setPhoto(result.uri);
        savePhoto(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo.');
    }
  };

  const handleAddBook = async () => {
    try {
      const userId = user.uid;
      await addDoc(collection(db, 'Books'), {
        userId,
        name,
        price,
        author,
        publisher,
        genre,
        imageUrl: photo,
      });
      // Clear input fields after adding the book
      setBookName('');
      setPrice('');
      setAuthor('');
      setPublisher('');
      setGenre('');
      setPhoto(null);
      Alert.alert('Success', 'Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Failed to add book.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomProfileHeader router={router}/>
      <Text style={styles.userName}>Name: {userName}</Text>
      <Text style={styles.userEmail}>Email: {uEmail}</Text>
      <View>

      <TouchableOpacity onPress={handleUploadPhoto}>
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={styles.uploadText}>Upload Photo</Text>
          )}
        </View>
      </TouchableOpacity>
          </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setBookName}
        placeholder="Book Name"
      />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Author"
      />
      <TextInput
        style={styles.input}
        value={publisher}
        onChangeText={setPublisher}
        placeholder="Publisher"
      />
      <TextInput
        style={styles.input}
        value={genre}
        onChangeText={setGenre}
        placeholder="Genre"
      />
      <TextInput
        style={styles.input}
        value={photo}
        onChangeText={setPhoto}
        placeholder="PhotoURL"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Text style={styles.addButtonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: '100%',
  },
  photoContainer: {
    width: 70,
    height: 70,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  uploadText: {
    fontSize: 16,
    color: 'black',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  userEmail: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
