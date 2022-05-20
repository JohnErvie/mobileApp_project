import React, {useContext} from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native';
import {AuthContext} from '../context/AuthContext';

import {AntDesign, Entypo} from '@expo/vector-icons';

const MoreScreen = ({navigation}) => {
  const {logout, rpiInfo} = useContext(AuthContext);
  return (
    <View style={styles.center}>
      <View style={{width: '80%'}}>
        {/*}
        <Text style={styles.textBold}>
          Raspberry Pi IP Address: {rpiInfo.ip_address}
        </Text>
        */}
        <View>
          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Edit Sensor Names');
              }}>
              <View style={styles.button}>
                <View style={{marginRight: 10, marginLeft: 10}}>
                  <AntDesign name="edit" size={24} color="black" />
                </View>
                <Text style={styles.buttonText}>{'Edit Sensor Names'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{marginBottom: 20}}>
            <TouchableOpacity>
              <View style={styles.button}>
                <View style={{marginRight: 10, marginLeft: 10}}>
                  <Entypo name="info-with-circle" size={24} color="black" />
                </View>

                <Text style={styles.buttonText}>{'About'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 80}}>
          <Button title="Logout" color="red" onPress={logout} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    //flex: 1,
    marginTop: 40,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: '#5f72ed',
    borderWidth: 1,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MoreScreen;
