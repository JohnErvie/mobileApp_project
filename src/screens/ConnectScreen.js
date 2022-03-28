import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const ConnectScreen = ({navigation}) => {
  const [ip_address, setIp_address] = useState(null);

  const {userInfo, setIsLoading, connectRpi, ipAddress, setIpAddress} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={ip_address}
          placeholder="Enter Ip Address of the Raspberry Pi"
          onChangeText={text => setIp_address(text)}
        />

        <Button
          title="Connect"
          onPress={() => {
            if(ip_address === "" || ip_address === null){
              Alert.alert("Error","Missing Required Field!");
            }
            else{
              var user_id = userInfo.user_id;
              connectRpi(ip_address, user_id);
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'blue',
  },
});

export default ConnectScreen;