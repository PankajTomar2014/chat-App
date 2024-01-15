import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation} from '@react-navigation/native';
let id = '';
const Users = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const user = await AsyncStorage.getItem('user');
    const { userId , email } = JSON.parse(user);
    console.log('userd------',userId)
    id = userId;
    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then(res => {  

        let tempData = [];
        if (res.docs != []) {
          console.log('dddddddd------',userId)
          const data = res.docs.map(i=>i.data());
          tempData = data.filter(i => i.userId != id)          
        }
        setUsers(tempData);
      }).catch((error)=>{
        console.log("list-error----",error.message)
        Alert.alert(error.message)
      });
  };
  return (
    <View
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Firebase Chat App</Text>
      </View>


      <TouchableOpacity
        style={{ 
          alignSelf:"flex-end",
          marginRight:30,
          backgroundColor:"black"
        }}
        onPress={async() => {
          await AsyncStorage.removeItem('user');
          navigation.navigate('Login');

        }}>
        <Text style={{color:"white",paddingVertical:10,paddingHorizontal:20}}>LogOut</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        ListEmptyComponent={()=> <Text style={{textAlign:"center",color:"black",fontSize:30,marginTop:30}}>{'No Data found'}</Text>}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={[styles.userItem, {backgroundColor: 'white'}]}
              onPress={() => {
                navigation.navigate('Chat', {data: item, id: id});
              }}>
              <Image
                source={{uri:"https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"}}
                style={styles.userIcon}
              />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Users;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  name: {color: 'black', marginLeft: 20, fontSize: 20},
});
