import React, {useContext, useEffect, useState, useCallback} from 'react';
import {AuthContext} from './../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const UsageMonthScreen = ({navigation}) => {
  const {getDataUsage, monthUsage, setIsLoading} = useContext(AuthContext);

  //on first mount, fetch data.
  useEffect(() => {
    getDataUsage('month');
    //console.log(anomalyData);
  }, []);

  //for refreshing the page
  const [refreshing, setRefreshing] = useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(0).then(() => {
      setRefreshing(false);
      //put the api function here
      getDataUsage('month');
    });
  }, []);

  //for displaying the items
  const Item = ({
    time,
    item,
    usage,
    sensor,
    percentage,
    backgroundColor,
    textColor,
    name,
  }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('UsageInfo', {
          item,
          time,
          name: 'Your Monthly Power Usage',
        })
      }
      style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{name}</Text>
      <Text style={[styles.title, textColor]}>
        {(parseFloat(usage) / 1000).toFixed(2) + ' KW'}
      </Text>
      <Text style={[styles.title, textColor]}>{percentage + '%'}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = '#000000';
    const color = 'white';

    return (
      <Item
        time={{time: 'month'}}
        item={item}
        name={item.sname}
        sensor={item.sensor}
        usage={item['sum(power_consumption)']}
        percentage={item.Percentage}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <View style={styles.center}>
      <Spinner visible={setIsLoading} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerText]}>{'Location'}</Text>
          <Text style={[styles.headerText]}>{'Usage'}</Text>
          <Text style={[styles.headerText]}>{'Percentage'}</Text>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.center}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View>
            <ScrollView horizontal={true} style={{width: '100%'}}>
              <FlatList data={monthUsage} renderItem={renderItem} />
            </ScrollView>
          </View>
        </ScrollView>
        <View>{}</View>
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
    marginLeft: 35,
    marginRight: 35,
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
  items: {
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 10,
  },
});

export default UsageMonthScreen;
