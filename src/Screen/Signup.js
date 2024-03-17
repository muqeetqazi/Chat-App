import React, { useState, useEffect } from "react";
import { Text, Image, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import Buttons from "../componets/Buttons";
import Input from "../componets/Input";
import { avatars } from "../Supports/avatar";
import pic from '../../assets/flower.jpg';
import { MaterialIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import Login from "./Login";
import { ScrollView } from "react-native";
import { BlurView } from "expo-blur";

const Signup = ({ navigation }) => {
    const screenWeight = Math.round(Dimensions.get("window").width);
    const screenHeight = Math.round(Dimensions.get("window").height);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [avatar, setAvatar] = useState(avatars[0]?.image?.asset?.url);
    const [isBlurVisible, setBlurVisible] = useState(false);
    
    useEffect(() => {
        if (isEmailTouched && (!email.includes('@') || !email.includes('.com'))) {
          setIsEmailValid(false);
        } else if (email === '') {
          setIsEmailValid(true);
        } else {
          setIsEmailValid(true);
        }
      
        if (isPasswordTouched && password.length < 6) {
          setIsPasswordValid(false);
        } else if (password === '') {
          setIsPasswordValid(true);
        } else {
          setIsPasswordValid(true);
        }
    }, [email, password, isEmailTouched, isPasswordTouched]);
      
    const handleEmailChange = (text) => {
        setEmail(text);
        setIsEmailTouched(true);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        setIsPasswordTouched(true);
    };
   
    const handleEditAvatar = () => {
        setBlurVisible(!isBlurVisible); // Toggle the visibility of the blur view
    };
    
    const handlesignup = async () => {
        if (isEmailValid && email !== "") {
            try {
                const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                const data = {
                    _id: userCred.user.uid,
                    name: name,
                    profilePic: avatar,
                    providerData: userCred.user.providerData[0]
                };
                await setDoc(doc(firestoreDB, 'user', userCred.user.uid), data);
                navigation.navigate("Login"); 
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    console.error("Email address is already in use.");
                } else {
                    console.error("Error creating user:", error.message);
                }
            }
        }
    };
    
    return (
        <View style={styles.container}>
            {isBlurVisible && (
                <View style={styles.blurContainer}>
                    <BlurView intensity={40} tint="light" style={{ width: screenWeight, height: "10%" }}>
    <TouchableOpacity style={styles.backButton} onPress={() => setBlurVisible(false)}>
        <MaterialIcons name="arrow-back" size={40} color="black" />
    </TouchableOpacity>
    <ScrollView contentContainerStyle={styles.avatarList}>
        {avatars?.map((item) => (
            <TouchableOpacity 
            key={item._id} 
            onPress={() => {
                setAvatar(item.image.asset.url);
                setBlurVisible(false); // Hide the blur view when an avatar is selected
            }}
        >
            <Image 
                source={{ uri: item?.image.asset.url }} 
                resizeMode="contain" 
                style={styles.avatarItem} 
            />
        </TouchableOpacity>
        
        ))}
    </ScrollView>
</BlurView>
                </View>
            )}
            <Image source={pic} style={styles.backgroundImage} resizeMode="cover" />
            <View style={styles.maincomponent}>
                <TouchableOpacity style={styles.avatarContainer} onPress={handleEditAvatar}>
                    <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="contain" />
                    <View style={styles.editIconContainer}>
                        <MaterialIcons name="edit" size={15} style={styles.editIcon} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.title}>Join with us!</Text>
                <View>
                <Input placeholder="Enter Email" value={email} onChangeText={handleEmailChange} />
                {!email && isEmailTouched && !isEmailValid && <Text style={{ marginLeft: 50, color: 'red' }}> Invalid Email</Text>}
                <Input placeholder="Enter Password" value={password} onChangeText={handlePasswordChange} />
                {!password && isPasswordTouched && !isPasswordValid && <Text style={{ marginLeft: 50, color: 'red' }}> Invalid Password</Text>}
                </View>
                <Buttons title='continue' onPress={handlesignup} />
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2,
    },
    editIcon: {
       // marginLeft: 10,
       color:"black",
       margin:10
      },
    
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '1000%',
        zIndex: 1, // Ensure the blur view is on top of other components
    },
    maincomponent: {
        borderTopLeftRadius: 10,
        borderTopLeftRadius: 110,
        backgroundColor: 'white', 
        marginTop: '40%',
    },
    avatarList: {
        flexDirection: 'row', // Display avatars in a single row
        flexWrap: 'wrap', // Allow avatars to wrap to the next row if needed
        justifyContent: 'center', // Center the avatars horizontally
        marginTop: 60, // Adjust the top margin as needed
        paddingHorizontal: 20,
        width: '100%', // Make the container take the full width of the screen
        height:'120%'
    },
    avatarItem: {
        width: 80, 
                                height: 80, 
                                borderRadius: 50, 
                                borderWidth: 3, 
                                borderColor: 'green',
                                margin: 10 
    },
    
    title: {
        fontSize: 20,
        color: '#77AB59',
        alignSelf: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%'
    },
    avatarContainer: {
        alignItems: "center",
        position: 'relative', // Ensure the container is relative for absolute positioning of the edit icon
        marginTop:10,
        marginBottom:10
        },
    avatarImage: {
        width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'green'
    },
    editIconContainer: {
        position: 'absolute',
        top: 0,
        right: 145,
        height: 25,
        backgroundColor: 'green',
        padding: 4,
        borderRadius: 12,
    },
    editIcon: {
        height: 20,
        color: '#fff',
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

export default Signup;
