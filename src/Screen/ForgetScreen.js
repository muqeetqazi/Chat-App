import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Buttons from '../componets/Buttons';
import { ActivityIndicator } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

function ForgetPassword({ navigation }) {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onRestoredPress = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert('Password reset email has been sent successfully.');
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
    setLoading(false);
    setEmailError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Your Password?</Text>
        <Text style={styles.subtitle}>Enter your email below to receive a password reset link.</Text>

        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
            <MaterialIcons name="mail" size={24} color="#777" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {loading ? <ActivityIndicator style={styles.spinner} color="pink" /> : null}

          <Buttons title="Reset Password" onPress={onRestoredPress} disabled={loading} />
        </View>

        <TouchableOpacity style={styles.goBack} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#36802D',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
    color: '#777',
  },
  input: {
    flex: 1,
    color: '#333',
  },
  spinner: {
    marginBottom: 15,
  },
  goBack: {
    alignSelf: 'center',
    marginTop: 20,
  },
  goBackText: {
    color: '#36802D',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default ForgetPassword;
