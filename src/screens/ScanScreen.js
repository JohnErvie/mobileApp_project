'use strict';

import React, {useContext, useState} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Button,
  View,
  Dimensions,
  Animated,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

import * as Animatable from 'react-native-animatable';
import {AntDesign, Entypo} from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

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

const ScanScreen = ({navigation}) => {
  const {setIsLoading, storeIp_address, connectRpi, RPI_ip_address} =
    useContext(AuthContext);
  const [password, setPassword] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const [visibleCheckIP, setVisibleCheckIP] = React.useState(false);

  var [isFlash, setIsFlash] = useState(false);

  var [scanner, setScanner] = useState();

  const onSuccess = e => {
    storeIp_address(e.data).then(response => {
      if (response[0]['Data'] != null) {
        setVisible(true);
      } else if (response[0]['Data'] == null) {
        setVisibleCheckIP(true);

        //scanner.reactivate();
      }
    });
    //setVisible(true);
  };

  const makeSlideOutTranslation = (translationType, fromValue) => {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  };

  return (
    <>
      <QRCodeScanner
        ref={node => {
          scanner = node;
          setScanner(scanner);
        }}
        showMarker={true}
        onRead={onSuccess}
        containerStyle={{
          alignItems: 'center',
          alignContent: 'center',
        }}
        cameraStyle={{
          height: 350,
          width: 350,
          //alignSelf: 'center',

          justifyContent: 'center',
          marginTop: 50,
        }}
        customMarker={
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle} />
            <Animatable.View
              style={styles.scanBar}
              direction="alternate-reverse"
              iterationCount="infinite"
              duration={1700}
              easing="linear"
              animation={makeSlideOutTranslation(
                'translateY',
                SCREEN_WIDTH * -0.54,
              )}
            />
          </View>
        }
        flashMode={
          isFlash
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        topContent={
          <>
            <Text style={styles.centerText}>
              Go to <Text style={styles.textBold}>Raspberry Pi</Text> on screen
              and scan the QR code.
            </Text>
          </>
        }
        bottomContent={<></>}
      />
      <View>
        <Button
          title="Flash On/Off"
          onPress={() => {
            isFlash = !isFlash;
            setIsFlash(isFlash);
            scanner.reactivate();
          }}
        />
        <View style={styles.textView}>
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={() => {
              navigation.navigate('Connect');
            }}>
            <Text style={styles.buttonText}>Type the IP Address Manually</Text>
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
                  scanner.reactivate();
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
                  scanner.reactivate();
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
                  }
                }}
              />
            </View>
          </View>
        </ModalPoup>

        <ModalPoup visible={visibleCheckIP}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.header}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
                Error
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleCheckIP(false);
                  scanner.reactivate();
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
              }}>
              <Text style={{color: 'black', fontSize: 15}}>
                {'No ' + RPI_ip_address + ' IP Address Registered.'}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'stretch',
                width: '100%',
                marginLeft: 25,
                marginTop: 20,
              }}>
              <Button
                title="OK"
                onPress={() => {
                  setVisibleCheckIP(false);
                  scanner.reactivate();
                }}
              />
            </View>
          </View>
        </ModalPoup>
      </View>
    </>
  );
};

const scanBarWidth = SCREEN_WIDTH * 0.56; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0065; //this is equivalent to 1 from a 393 device width
const scanBarColor = '#22ff00';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 18,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  link: {
    color: 'blue',
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 7,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },
  wrapper: {
    width: '80%',
    //alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper2: {
    width: '100%',
    //alignItems: 'center',
    justifyContent: 'center',
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
  modalBackGround2: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer2: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
});

export default ScanScreen;
