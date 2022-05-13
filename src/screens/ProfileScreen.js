import React, {useContext} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {AuthContext} from '../context/AuthContext';

const ProfileScreen = () => {
  const {logout, rpiInfo} = useContext(AuthContext);
  return (
    <View style={styles.center}>
      <Text style={styles.textBold}>
        Raspberry Pi IP Address: {rpiInfo.ip_address}
      </Text>
      <Button title="Logout" color="red" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
});

export default ProfileScreen;
