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
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0].image.asset.url);
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
              // Redirect to HomeScreen upon successful login
              navigation.replace('HomeScreen');
            } else {
              alert('User does not exist');
            }
          });
        }
      } catch (error) {
        console.error('Error logging in:', error.message);
        if (error.code === 'auth/invalid-credential') {
          // Handle invalid credential error
          alert('Invalid credentials. Please check your email and password.');
        } else {
          // Handle other errors
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
        <Input placeholder="Enter Email" value={email} onChangeText={handleEmailChange} />
        {!email == '' && isEmailTouched && !isEmailValid && <Text style={{ marginLeft: 50, color: 'red' }}> Invalid Email</Text>}
        <Input placeholder="Enter Password" secureTextEntry={true} value={password} onChangeText={handlePasswordChange} />
        {!password == '' && isPasswordTouched && !isPasswordValid && <Text style={{ marginLeft: 50, color: 'red' }}> Invalid Password</Text>}
        <Buttons title='Login' onPress={handlelogin} />
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

export default Login;
