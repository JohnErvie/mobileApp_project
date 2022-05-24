import React, {useContext, useState, useEffect} from 'react';
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
import * as Progress from 'react-native-progress';

const CollectDataScreen = ({navigation}) => {
  const {
    setIsLoading,
    sensorInfo,
    rpiInfo,
    RPI_ip_address,
    s1Status,
    s2Status,
    s4Status,
    checkingData,
  } = useContext(AuthContext);

  useEffect(() => {
    const intervalIdProgress = setInterval(() => {
      let componentMountedProgress = true;
      const fetchDataProgress = async () => {
        //you async action is here
        if (componentMountedProgress) {
          checkingData(rpiInfo.rpi_id);
        }
      };
      fetchDataProgress();
      return () => {
        componentMountedProgress = false;
      };
    }, 2000); //refresh in 2 second

    return () => {
      clearInterval(intervalIdProgress);
    }; //This is important
  }, []);

  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <View style={styles.wrapper}>
        <View
          style={{
            marginBottom: 50,
            flexDirection: 'column',
          }}>
          <View
            style={{
              marginBottom: 50,
            }}>
            <Text style={[styles.centerText, {marginBottom: 40}]}>
              Collecting And Processing The Data{' '}
            </Text>
            <Text style={styles.textBold}>
              {'This process requires atleast 1 day data to proceed'}
            </Text>
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{sensorInfo.sensor1}</Text>
            <View style={{flexDirection: 'row'}}>
              <Progress.Bar progress={s1Status} width={250} height={20} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#777',
                  marginLeft: 20,
                }}>
                {s1Status * 100 + '%'}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text style={styles.inputLabel}>{sensorInfo.sensor2}</Text>
            <View style={{flexDirection: 'row'}}>
              <Progress.Bar progress={s2Status} width={250} height={20} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#777',
                  marginLeft: 20,
                }}>
                {s2Status * 100 + '%'}
              </Text>
            </View>
          </View>
          {/*
          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{sensorInfo.sensor3}</Text>
            <View style={{flexDirection: 'row'}}>
              <Progress.Bar progress={parseFloat(s3Status)} width={250} height={20} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#777',
                  marginLeft: 20,
                }}>
                {s3Status * 100 + '%'}
              </Text>
            </View>
          </View>
          */}
          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{sensorInfo.sensor4}</Text>
            <View style={{flexDirection: 'row'}}>
              <Progress.Bar progress={s4Status} width={250} height={20} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#777',
                  marginLeft: 20,
                }}>
                {s4Status * 100 + '%'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: 20,
    color: '#777',
    justifyContent: 'center',
    textAlign: 'center',
  },
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
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#777',
    marginTop: 10,
    marginRight: 20,
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

export default CollectDataScreen;
