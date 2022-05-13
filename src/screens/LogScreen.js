import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

const LogScreen = () => {
  const {anomalyData, getAnomalyData} = useContext(AuthContext);

  //on first mount, fetch data.
  useEffect(() => {
    getAnomalyData();
    //console.log(anomalyData);
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(0).then(() => {
      setRefreshing(false);
      getAnomalyData();
    });
  }, []);

  const Item = ({
    power,
    sensor,
    datetime,
    onPress,
    backgroundColor,
    textColor,
  }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>
        {sensor + '    '} {datetime + '   '} {power}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = '#000000';
    const color = 'white';

    return (
      <Item
        sensor={item.sensor}
        datetime={item.datetime}
        power={item.power_consumption}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <View style={styles.center}>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={[styles.headerText]}>
            {'     Location\t\t\t\t\t\t\tDateTime\t\t\t\t\t\t\t\t\tPower'}
          </Text>
        </View>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.center}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View>
            <ScrollView horizontal={true} style={{width: '100%'}}>
              <FlatList data={anomalyData} renderItem={renderItem} />
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 15,
    color: '#f5f5fa',
  },
  headerText: {
    fontSize: 15,
    color: '#000000',
  },
});

export default LogScreen;
