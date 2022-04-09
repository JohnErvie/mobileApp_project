'use strict';

import React, {useContext, useState} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Button,
  View,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const ScanScreen = ({navigation}) => {
  const {setIsLoading, storeIp_address} = useContext(AuthContext);

  var [isFlash, setIsFlash] = useState(false);

  const onSuccess = e => {
    storeIp_address(e.data, navigation);
  };

  return (
    <>
      <QRCodeScanner
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
            //this.scanner.reactivate();
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
      </View>
    </>
  );
};

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
});

export default ScanScreen;
