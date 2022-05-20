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
import {useToast} from 'react-native-toast-notifications';

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

const ChangeSensorScreen = ({navigation}) => {
  const {setIsLoading, rpiInfo, sensorName, sensorInfo} =
    useContext(AuthContext);

  var [sensor1, setSensor1] = useState(sensorInfo.sensor1);
  var [sensor2, setSensor2] = useState(sensorInfo.sensor2);
  var [sensor3, setSensor3] = useState(sensorInfo.sensor3);
  var [sensor4, setSensor4] = useState(sensorInfo.sensor4);

  const [visibleMissingField, setVisibleMissingField] = React.useState(false);

  const [visibleSameField, setVisibleSameField] = React.useState(false);

  // for toast notification
  const toast = useToast();

  return (
    <View style={styles.container}>
      <Spinner visible={setIsLoading} />
      <View style={styles.wrapper}>
        <View
          style={{
            marginBottom: 50,
            flexDirection: 'column',
          }}>
          <View style={{marginBottom: 50}}>
            <Text style={styles.centerText}>
              Enter the Sensor Location Name{' '}
              <Text style={styles.textBold}>{' (ex. Living Room)'}</Text>
            </Text>
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{'Sensor 1'}</Text>
            <TextInput
              style={styles.TxtInput}
              value={sensor1}
              placeholder="Default: Sensor 1"
              onChangeText={text => setSensor1(text)}
              placeholderTextColor="#808080"
            />
          </View>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text style={styles.inputLabel}>{'Sensor 2'}</Text>
            <TextInput
              style={styles.TxtInput}
              value={sensor2}
              placeholder="Default: Sensor 1"
              onChangeText={text => setSensor2(text)}
              placeholderTextColor="#808080"
            />
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{'Sensor 3'}</Text>
            <TextInput
              style={styles.TxtInput}
              value={sensor3}
              placeholder="Default: Sensor 3"
              onChangeText={text => setSensor3(text)}
              placeholderTextColor="#808080"
            />
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{'Sensor 4'}</Text>
            <TextInput
              style={styles.TxtInput}
              value={sensor4}
              placeholder="Default: Sensor 4"
              onChangeText={text => setSensor4(text)}
              placeholderTextColor="#808080"
            />
          </View>
        </View>

        <Button
          title="Proceed"
          onPress={() => {
            if (
              sensor1 === '' ||
              sensor1 === null ||
              sensor2 === '' ||
              sensor2 === null ||
              sensor3 === '' ||
              sensor3 === null ||
              sensor4 === '' ||
              sensor4 === null
            ) {
              setVisibleMissingField(true);
            } else if (
              sensor1 == sensorInfo.sensor1 &&
              sensor2 == sensorInfo.sensor2 &&
              sensor3 == sensorInfo.sensor3 &&
              sensor4 == sensorInfo.sensor4
            ) {
              // if no changes
              setVisibleSameField(true);
            } else {
              sensorName(rpiInfo.rpi_id, sensor1, sensor2, sensor3, sensor4);
              toast.show('Successfully Changed', {
                type: 'success',
                placement: 'bottom',
                duration: 4000,
                offset: 30,
                animationType: 'slide-in | zoom-in',
              });
            }
          }}
        />
      </View>

      <ModalPoup visible={visibleSameField}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              No Changes
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisibleSameField(false);
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
              {'There is/are no changes.'}
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
                setVisibleSameField(false);
              }}
              //color="grey"
            />
          </View>
        </View>
      </ModalPoup>

      <ModalPoup visible={visibleMissingField}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              Missing Field
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisibleMissingField(false);
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
              {
                'There is/are Missing field. Do you want to continue with the default value of sensor location name?'
              }
            </Text>
          </View>

          <View
            style={{
              alignItems: 'stretch',
              width: '100%',
              marginLeft: 25,
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              title="Cancel"
              onPress={() => {
                setVisibleMissingField(false);
              }}
              color="grey"
            />
            <Button
              title="Proceed"
              onPress={() => {
                sensor1 = 'Sensor 1';
                setSensor1(sensor1);
                sensor2 = 'Sensor 2';
                setSensor2(sensor2);
                sensor3 = 'Sensor 3';
                setSensor3(sensor3);
                sensor4 = 'Sensor 4';
                setSensor3(sensor4);
                sensorName(rpiInfo.rpi_id, sensor1, sensor2, sensor3, sensor4);
                toast.show('Successfully Changed', {
                  type: 'warning',
                  placement: 'bottom',
                  duration: 4000,
                  offset: 30,
                  animationType: 'slide-in | zoom-in',
                });
              }}
            />
          </View>
        </View>
      </ModalPoup>
    </View>
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    color: '#777',
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

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  TxtInput: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 14,
    color: '#000',
    width: '100%',
    fontSize: 16,
    padding: 10,
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

export default ChangeSensorScreen;
