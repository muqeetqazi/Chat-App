import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import Input from '../componets/Input';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../config/firebase";

import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const AddToChatScreen = (props) => {
  const navigation=useNavigation();
    const user = useSelector((state) => state.user);
    const[addChat,setAddChat]=useState("")
    const createNewChat = async () => {
      let id = `${Date.now()}`;

      // Use the unique ID (timestamp) to create a new chat
      const _doc={
        _id:id,
        user:user,
        ChatName:addChat

      }
      if(addChat!="")
      {
        setDoc(doc(firestoreDB,"chats",id),_doc).then(()=>{
          setAddChat("")
          navigation.replace("HomeScreen")
        }).catch((err)=>{
          console.log("Error:".err);
        })
      }
    }
  
  return (
    <View style={styles.container}>
        <TouchableOpacity style={{top:40,left:10}} onPress={() => props.navigation.goBack()}>
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
      flexDirection: 'row', // Use flexDirection: 'row' to align items horizontally
      alignItems: 'center', // Align items vertically in the center
      marginTop: 50,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 10, // Add padding to the container
    }}>
      <Ionicons name="chatbubbles" size={24} color={"#777"} style={{ marginRight: 10 }} />
      <TextInput 
        style={{ flex: 1 }} // Take up remaining space
        placeholder='Create a new chat' 
        value={addChat}
        onChangeText={(text)=>setAddChat(text)}
      />
      <TouchableOpacity onPress={createNewChat}>
        <FontAwesome name="send" size={24} color={'#777'} />
      </TouchableOpacity>
    </View>
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
    borderTopRightRadius:60,
    backgroundColor: '#FAF9F6',
    marginTop: '30%',
    flex:1
  },
  logo: {
    alignSelf: 'center',
    height: '5%'
  },
  title: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%'
  },
  avatarImage: {
    width: 50,
    height: 50,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: '25%',
    fontSize: 15,
  },
  loginText: {
    color: 'black',
  },
  loginLink: {
    color: '#36802D',
  }
});

export default AddToChatScreen;
