import React, { useState } from "react";
import react from "react";
import { Text,View,StyleSheet,TextInput } from "react-native";
const Input=(props)=>{
 
    return(
    <View >
        <TextInput placeholder={props.placeholder} secureTextEntry={props.secureTextEntry} style={styles.input} value={props.value} onChangeText={props.onChangeText}/>
    </View>
)
}

const styles=StyleSheet.create(
    {
       
        input:{
            width:'90%',
            height:50,
            borderWidth:0.5,
            borderRadius:10,
            marginTop: 25,
            alignSelf:'center',
            paddingLeft:20,
            
        }
    }
)
export default Input;