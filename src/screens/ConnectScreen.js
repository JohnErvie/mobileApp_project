import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Animated,
  Modal,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import {AntDesign, Entypo} from '@expo/vector-icons';

const ModalPoup = ({visible, children}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const ConnectScreen = ({navigation}) => {
  var [ip_address, setIp_address] = useState(null);

  var [password, setPassword] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const {setIsLoading, storeIp_address, RPI_ip_address, connectRpi} =
    useContext(AuthContext);

  var checkIP;

  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <View style={styles.wrapper}>
        <View style={{marginBottom: 20}}>
          <TextInput
            style={styles.input}
            value={ip_address}
            placeholder="Enter Ip Address of the Raspberry Pi"
            onChangeText={text => setIp_address(text)}
            placeholderTextColor="#808080"
          />
        </View>

        <Button
          title="Connect"
          onPress={() => {
            if (ip_address === '' || ip_address === null) {
              Alert.alert('Error', 'Missing Required Field!');
            } else {
              storeIp_address(ip_address).then(response => {
                if (response[0]['Data'] != null) {
                  setVisible(true);
                  ip_address = '';
                  setIp_address(ip_address);
                } else {
                  setVisible(false);
                }
              });

              /*
              if (checkIP['Data'] != null) {
                console.log('zzz');
                setVisible(true);
                ip_address = '';
                setIp_address(ip_address);
              } else {
                setVisible(false);
              }*/
            }
          }}
        />
      </View>

      <View style={styles.textView}>
        <TouchableOpacity
          style={styles.buttonTouchable}
          onPress={() => {
            navigation.navigate('QRScanner');
          }}>
          <Text style={styles.buttonText}>Scan Using QRCode</Text>
        </TouchableOpacity>
      </View>

      <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              IP Address Password
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}>
              <AntDesign name="closecircle" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.wrapper}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: 45,
              marginTop: 40,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
              IP Address :
            </Text>
            <Text style={{color: 'black', fontSize: 15}}>
              {' ' + RPI_ip_address}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              //justifyContent: 'center',
              marginTop: 20,
              marginBottom: 40,
              alignItems: 'stretch',
            }}>
            <Entypo name="lock" size={50} color="black" />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter the IP Address Password"
              onChangeText={text => setPassword(text)}
              placeholderTextColor="#808080"
              secureTextEntry={true}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Cancel"
              onPress={() => {
                setVisible(false);
                password = '';
                setPassword(password);
              }}
              color="grey"
            />

            <Button
              title="Connect"
              onPress={() => {
                if (password === '' || password === null) {
                  Alert.alert('Error', 'Missing Required Field!');
                } else {
                  connectRpi(password);
                  password = '';
                  setPassword(password);
                }
              }}
            />
          </View>
        </View>
      </ModalPoup>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 30,
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 1,
    color: '#000',
  },
  button: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignContent: 'center',
    marginLeft: 20,
    width: '100%',
  },
});

export default ConnectScreen;
