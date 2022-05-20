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

const AnomalyRecordScreen = () => {
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
    backgroundColor,
    textColor,
    name,
  }) => (
    <TouchableOpacity style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{name}</Text>
      <Text style={[styles.title, textColor]}>{datetime.slice(0, 22)}</Text>
      <Text style={[styles.title, textColor]}>{power}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = '#000000';
    const color = 'white';

    return (
      <Item
        name={item.sname}
        sensor={item.sensor}
        datetime={item.datetime}
        power={item.power_consumption}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <>
      <View style={styles.center}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerText]}>{'Location'}</Text>
            <Text style={[styles.headerText]}>{'DateTime'}</Text>
            <Text style={[styles.headerText]}>{'Power'}</Text>
          </View>

          <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={styles.center}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {anomalyData ? (
              <View>
                <ScrollView horizontal={true} style={{width: '100%'}}>
                  <FlatList data={anomalyData} renderItem={renderItem} />
                </ScrollView>
              </View>
            ) : (
              <View>
                <Text
                  style={[
                    styles.title,
                    {color: 'black', fontSize: 15, fontWeight: '500'},
                  ]}>
                  {'No Data'}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 2,
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: 15,
    color: '#f5f5fa',
  },
  headerText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  header: {
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 10,
  },
});

export default AnomalyRecordScreen;
