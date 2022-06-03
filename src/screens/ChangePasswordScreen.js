import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

import {AntDesign, Entypo, MaterialCommunityIcons} from '@expo/vector-icons';

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

const ChangePasswordScreen = ({navigation}) => {
  const {rpiInfo, changePassword} = useContext(AuthContext);
  var [password, setPassword] = useState(rpiInfo.password);

  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <View style={styles.center}>
        <View style={{width: '80%'}}>
          <View style={{marginBottom: 70}}>
            <Text style={styles.titleTxt}>{'Raspberry Pi'}</Text>
          </View>

          <View style={{marginBottom: 30}}>
            <Text style={styles.textBold}>
              {'IP Address: '}
              <Text style={{color: '#000', fontWeight: 'normal'}}>
                {rpiInfo.ip_address}
              </Text>
            </Text>
          </View>

          <View style={{marginBottom: 10}}>
            <Text style={styles.inputLabel}>{'Password: '}</Text>
            <TextInput
              style={styles.TxtInput}
              value={password}
              placeholder="Enter the Password"
              onChangeText={text => setPassword(text)}
              placeholderTextColor="#808080"
              secureTextEntry={true}
            />
          </View>

          <View style={{marginTop: 80}}>
            <Button
              title="Change Password"
              color="blue"
              onPress={() => {
                setVisible(true);
              }}
            />
          </View>
        </View>
      </View>

      <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              Automatically Logout?
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
            }}>
            <Text style={{color: 'black', fontSize: 15}}>
              {'You are automatically logging out. You want to continue?'}
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
            <View style={{marginLeft: 20}}>
              <Button
                title="No"
                onPress={() => {
                  setVisible(false);
                }}
                color="grey"
              />
            </View>
            <View style={{marginRight: 50}}>
              <Button
                title="Yes"
                onPress={() => {
                  setVisible(false);
                  changePassword(password);
                }}
              />
            </View>
          </View>
        </View>
      </ModalPoup>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    //flex: 1,
    marginTop: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
    fontSize: 18,
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
  titleTxt: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
    textAlign: 'center',
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
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
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
});

export default ChangePasswordScreen;
