import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from "react-redux";
import Input from '../componets/Input';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../config/firebase";
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddToChatScreen = (props) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [addChat, setAddChat] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);

  useEffect(() => {
    // Request permission to access the photo library
    (async () => {
      if (Platform.OS !== 'web') {
        // Remove image picker permission request
      }
    })();
  }, []);

  // Function to create a new chat
  const createNewChat = async () => {
    let id = `${Date.now()}`;
  
    // Use the unique ID (timestamp) to create a new chat
    const _doc = {
      _id: id,
      user: user,
      ChatName: addChat,
      groupLogo: selectedLogo // Include selected logo in the document
    }
  
    if (addChat !== "") {
      setDoc(doc(firestoreDB, "chats", id), _doc).then(() => {
        setAddChat("");
        setSelectedLogo(null);
        navigation.replace("HomeScreen");
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

        {/* Social media icons for group logo selection */}
        <View style={styles.socialMediaIcons}>
          <TouchableOpacity onPress={() => setSelectedLogo('facebook')}>
            <FontAwesome name="facebook-square" size={50} color={selectedLogo === 'facebook' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('twitter')}>
            <FontAwesome name="twitter-square" size={50} color={selectedLogo === 'twitter' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('instagram')}>
            <FontAwesome name="instagram" size={50} color={selectedLogo === 'instagram' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('tiktok')}>
            <FontAwesome name="tiktok" size={50} color={selectedLogo === 'tiktok' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('youtube')}>
            <FontAwesome name="youtube" size={50} color={selectedLogo === 'youtube' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('slack')}>
            <FontAwesome name="slack" size={50} color={selectedLogo === 'slack' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('discord')}>
            <FontAwesome name="discord" size={50} color={selectedLogo === 'discord' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('upwork')}>
            <FontAwesome name="upwork" size={50} color={selectedLogo === 'upwork' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLogo('fiverr')}>
            <FontAwesome name="fiverr" size={50} color={selectedLogo === 'fiverr' ? '#36802D' : 'gray'} />
          </TouchableOpacity>
          {/* Add more social media icons as needed */}
        </View>

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
  socialMediaIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: '25%',
    fontSize: 15,
  },
});

export default AddToChatScreen;
