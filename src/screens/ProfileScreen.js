import React, { useContext } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import {AuthContext} from '../context/AuthContext';

const ProfileScreen = () => {
  const {logout, userInfo} = useContext(AuthContext);
  return (
    <View style={styles.center}>
      <Text>Welcome {userInfo.name}</Text>
      <Button title="Logout" color="red" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default ProfileScreen;