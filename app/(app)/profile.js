import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
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

  return (
    <View style={styles.container}>
      
      <Text style={styles.userName}>Name: {userName}</Text>
      <Text style={styles.userEmail}>Email: {uEmail}</Text>
      <CustomProfileHeader router={router}/>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: '100%'
  },
  photoContainer: {
    width: 150,
    height: 150,
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
});

export default ProfilePage;
