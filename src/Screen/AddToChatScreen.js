import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Button } from 'react-native'; // Import Button
import { useSelector } from "react-redux";
import Input from '../componets/Input';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../config/firebase";
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker

import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddToChatScreen = (props) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [addChat, setAddChat] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  useEffect(() => {
    // Request permission to access the photo library
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const selectImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) { // Updated from result.cancelled
      const selectedImage = result.assets[0]; // Accessing selected image through assets array
      setGroupImage(selectedImage.uri);
    }
  };
  
  // Function to open image picker
  const createNewChat = async () => {
    let id = `${Date.now()}`;
  
    // Use the unique ID (timestamp) to create a new chat
    const _doc = {
      _id: id,
      user: user,
      ChatName: addChat,
      groupImage: groupImage // Include group image in the document
    }
  
    if (addChat != "") {
      setDoc(doc(firestoreDB, "chats", id), _doc).then(() => {
        setAddChat("");
        setGroupImage(null); // Reset group image after creating chat
        navigation.replace("HomeScreen", { groupImage: _doc.groupImage }); // Replace with groupImage variable
  
      }).catch((err) => {
        console.log("Error:", err);
      })
    }
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ top: 40, left: 10 }} onPress={() => props.navigation.goBack()}>
        <MaterialIcons name="chevron-left" size={32} color={'white'} />
      </TouchableOpacity>
      <TouchableOpacity style={{ position: 'absolute', right: 20, top: 35 }} onPress={() => console.log('Profile picture pressed')}>
        <Image
          source={{ uri: user.profilePic }}
          resizeMode="cover"
          style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#77AB59' }}
        />
      </TouchableOpacity>
      <View style={styles.maincomponent}>

        <View style={{
          width: '80%',
          height: 50,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 15,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 50,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 10,
        }}>
          <Ionicons name="chatbubbles" size={24} color={"#777"} style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1 }}
            placeholder='Create a new chat'
            value={addChat}
            onChangeText={(text) => setAddChat(text)}
          />
        </View>

        {/* Button to select image from gallery */}
        <Button title="Select Image" onPress={selectImageFromGallery} />

        {/* Display selected group image */}
        {groupImage && (
          <Image
            source={{ uri: groupImage }}
            style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 20 }}
          />
        )}

        <TouchableOpacity style={{ marginTop: 20 }} onPress={createNewChat}>
          <Text style={{ fontSize: 20, color: '#36802D', alignSelf: 'center' }}>Create Chat</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#36802d',
  },
  maincomponent: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: '#FAF9F6',
    marginTop: '30%',
    flex: 1
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: '25%',
    fontSize: 15,
  },
});

export default AddToChatScreen;