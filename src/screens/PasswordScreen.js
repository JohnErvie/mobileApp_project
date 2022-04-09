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

const PasswordScreen = ({navigation}) => {
  const [password, setPassword] = useState(null);

  const {setIsLoading, connectRpi, RPI_ip_address} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <View style={styles.textView}>
        <Button
          title="Back"
          onPress={() => {
            navigation.navigate('QRScanner');
          }}
        />
      </View>

      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter the Password"
          onChangeText={text => setPassword(text)}
          placeholderTextColor="#808080"
        />

        <Button
          title="Connect"
          onPress={() => {
            if (password === '' || password === null) {
              Alert.alert('Error', 'Missing Required Field!');
            } else {
              connectRpi(password);
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
    color: '#000',
  },
  link: {
    color: 'blue',
  },
  textView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonText: {
    fontSize: 18,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default PasswordScreen;
