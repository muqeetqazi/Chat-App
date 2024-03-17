import React from "react";
import {Text,Image,View,StyleSheet,TouchableOpacity} from "react-native"
const Buttons=(props)=>{
    return(
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
        <Text style={{alignSelf:'center',color:'#FFFFFF',fontSize:18,fontWeight:'bold'}}>{props.title}</Text>
    </TouchableOpacity>
    )
}
const styles=StyleSheet.create(
    {
        container:{
        backgroundColor:'#36802D',
        height:43,
        width:'90%',
        borderRadius:10,
        justifyContent:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:20
        }
    }
)
export default Buttons;