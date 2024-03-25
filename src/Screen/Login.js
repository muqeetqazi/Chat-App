import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firestoreDB, firebaseAuth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../context/actions/useractions';
import Input from '../componets/Input';
import Buttons from '../componets/Buttons';
import { useNavigation } from '@react-navigation/native';
import { avatars } from '../Supports/avatar';
import pic from '../../assets/flower.jpg';
import logo from '../../assets/logo.png'
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import ForgetPassword from './ForgetScreen';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0].image.asset.url);
  const [hidePassword, setHidePassword] = useState(true); 
    
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword); // Toggle the state value
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsPasswordTouched(true);
  };

  const handlelogin = async () => {
    if (isEmailValid && email !== '') {
      try {
        const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        if (userCred) {
          console.log('User ID:', userCred.user.uid);
          getDoc(doc(firestoreDB, 'user', userCred.user.uid)).then((docSnap) => {
            if (docSnap.exists()) {
              console.log('user data:', docSnap.data());
              dispatch(SET_USER(docSnap.data()));
              
              navigation.replace('HomeScreen');
            } else {
              alert('User does not exist');
            }
          });
        }
      } catch (error) {
        console.error('Error logging in:', error.message);
        if (error.code === 'auth/invalid-credential') {
          
          alert('Invalid credentials. Please check your email and password.');
        } else {
          
          alert('Error logging in. Please try again later.');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={pic} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.maincomponent}>
        <Image source={logo} style={styles.logo} resizeMode='contain' />
        
        <Text style={styles.title}>Welcome back!!</Text>
        <View style={{ width: '90%', height: 50, borderWidth: 1, borderColor: 'gray', borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 10 }}>
    <MaterialIcons name="mail" size={24} color="#777" style={{ marginRight: 10 }} />
    <TextInput
        style={{ flex: 1 }}
        placeholder="Enter Email"
        value={email}
        onChangeText={handleEmailChange}
    />
    {!email == '' && isEmailTouched && !isEmailValid &&  (
        <TouchableOpacity onPress={() => alert("Please use @ and com in your email")}>
            <MaterialIcons name="error" size={24} color="red" />
        </TouchableOpacity>
    )}
</View>
<View style={{ width: '90%', height: 50, borderWidth: 1, borderColor: 'gray', borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 10 }}>
  <MaterialIcons name="vpn-key" size={24} color='#777' style={{ marginRight: 10 }} />
  <TextInput
    style={{ flex: 1 }}
    placeholder="Enter Password"
    value={password}
    onChangeText={handlePasswordChange}
    secureTextEntry={hidePassword} // Use secureTextEntry prop to hide/show password
  />
  <TouchableOpacity onPress={togglePasswordVisibility} style={{ position: 'absolute', right: 10 }}>
    <MaterialIcons
      name={hidePassword ? 'visibility-off' : 'visibility'} // Use appropriate icon based on hidePassword state
      size={24}
      color={!isPasswordValid ? 'red' : '#777'}
    />
  </TouchableOpacity>
  {!password == '' && isPasswordTouched && !isPasswordValid && (
    <TouchableOpacity onPress={() => alert("Please use a password with at least 6 characters")}>
      <MaterialIcons
        name={hidePassword ? 'visibility-off' : 'visibility'} // Use appropriate icon based on hidePassword state
        size={24}
        color={!isPasswordValid ? 'red' : '#777'}
      />
    </TouchableOpacity>
  )}
</View>

        <Buttons title='Login' onPress={handlelogin} />
        <View style={{ position: 'absolute',top:290, left: 210,margin:10 }}>
  <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
    <Text style={{ color: '#36802D', fontSize: 13, textDecorationLine: 'underline' }}>Forget Password?</Text>
  </TouchableOpacity>
</View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Does't have an account??</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.loginLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  maincomponent: {
    borderTopLeftRadius: 110,
    backgroundColor: '#FAF9F6',
    marginTop: '40%'
  },
  logo: {
    alignSelf: 'center',
    height: '15%'
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
    height: '50%'
  },
  avatarImage: {
    width: 50,
    height: 50,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 50,
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

export default Login;
