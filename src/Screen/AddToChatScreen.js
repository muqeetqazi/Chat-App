import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert, FlatList } from 'react-native';
import { useSelector } from "react-redux";
import { FontAwesome, MaterialIcons, Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase";
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddToChatScreen = () => {
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
    if (!addChat.trim()) {
      Alert.alert('Error', 'Please enter a valid chat name.');
      return;
    }

    let id = `${Date.now()}`;
  
    // Use the unique ID (timestamp) to create a new chat
    const _doc = {
      _id: id,
      user: user,
      ChatName: addChat,
      groupLogo: selectedLogo // Include selected logo in the document
    }
  
    setDoc(doc(firestoreDB, "chats", id), _doc).then(() => {
      setAddChat("");
      setSelectedLogo(null);
      navigation.replace("HomeScreen");
    }).catch((err) => {
      console.log("Error:", err);
      Alert.alert('Error', 'Failed to create chat. Please try again later.');
    });
  }

  
  const socialMediaIcons = [
    { name: 'instagram', selected: selectedLogo === 'instagram' },
    { name: 'facebook', selected: selectedLogo === 'facebook' },
    { name: 'youtube', selected: selectedLogo === 'youtube' },
    { name: 'linkedin', selected: selectedLogo === 'linkedin' },
    { name: 'twitter', selected: selectedLogo === 'twitter' },
    { name: 'snapchat-ghost', selected: selectedLogo === 'snapchat' },
    { name: 'whatsapp', selected: selectedLogo === 'whatsapp' },
    { name: 'pinterest', selected: selectedLogo === 'pinterest' },
    { name: 'twitch', selected: selectedLogo === 'twitch' },
    { name: 'reddit', selected: selectedLogo === 'reddit' },
    { name: 'slack', selected: selectedLogo === 'slack' },
    
  ];

  // Render item for FlatList
  const renderIcon = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedLogo(item.name)}>
      <FontAwesome name={item.name} size={50} color={item.selected ? '#36802D' : 'gray'} style={{ marginHorizontal: 10 }} />
    </TouchableOpacity>
  );

  return (
            <View style={styles.container}>
              <TouchableOpacity style={{ top: 40, left: 10 }} onPress={() => navigation.goBack()}>
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
                  <TextInput
                    style={{ flex: 1 }}
                    placeholder='Create a new chat'
                    value={addChat}
                    onChangeText={(text) => setAddChat(text)}
                  />
                </View>

                <FlatList
          data={socialMediaIcons}
          renderItem={renderIcon}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.socialMediaIcons, { height: 100 }]} 
        />

                <TouchableOpacity style={styles.createChatButton} onPress={createNewChat}>
                  <Text style={styles.createChatButtonText}>Create Chat</Text>
                </TouchableOpacity>

                
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
    flex: 1,
    alignItems: 'center',
  },
  socialMediaIcons: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  createChatButton: {
    marginBottom: 150,
    backgroundColor: '#36802D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createChatButtonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
  additionalFunctionalityButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default AddToChatScreen;
