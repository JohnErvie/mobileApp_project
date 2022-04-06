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

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {setIsLoading, login} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter email"
          onChangeText={text => setEmail(text)}
          placeholderTextColor="#808080"
          Color
        />

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#808080"
          onChangeText={text => setPassword(text)}
          secureTextEntry
          theme={{
            colors: {
              placeholder: 'black',
              primary: 'black',
              text: 'black',
            },
          }}
        />

        <Button
          title="Login"
          onPress={() => {
            if (
              email === '' ||
              password === '' ||
              email === null ||
              password === null
            ) {
              Alert.alert('Error', 'Missing Required Field!');
            } else {
              login(email, password);
            }
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={styles.textView}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
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
  textView: {
    color: '#000',
  },
  link: {
    color: 'blue',
  },
});

export default LoginScreen;
