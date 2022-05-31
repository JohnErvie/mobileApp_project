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
  Modal,
  Animated,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

import {Ionicons, AntDesign} from '@expo/vector-icons';

import {Picker} from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

const AnomalyRecordScreen = () => {
  const {anomalyData, getAnomalyData, sensorInfo} = useContext(AuthContext);

  //for anomaly filters
  var [pickerSort, setPickerSort] = React.useState('Date');
  var [pickerDate, setPickerDate] = React.useState('Today');
  var [pickerRows, setPickerRows] = React.useState('10');
  var [pickerSensor, setPickerSensor] = React.useState('All');

  const [filterData, setFilterData] = React.useState([]);

  const [visible, setVisible] = React.useState(false);

  //loading current filter data
  const loadFilterData = async (
    pickerSort,
    pickerDate,
    pickerRows,
    pickerSensor,
  ) => {
    try {
      AsyncStorage.removeItem('filterData');
      setFilterData({});

      let filterData1 = [
        {
          Sort: pickerSort,
          Date: pickerDate,
          Rows: pickerRows,
          Sensor: pickerSensor,
        },
      ];
      //setFilterData(filterData1);

      AsyncStorage.setItem('filterData', JSON.stringify(filterData1));

      let filterData = await AsyncStorage.getItem('filterData');
      filterData = JSON.parse(filterData);
      if (filterData) {
        setFilterData(filterData);
        //console.log(filterData);
        getAnomalyData(
          filterData.Sort,
          filterData.Date,
          filterData.Rows,
          filterData.Sensor,
        );
      }
    } catch (e) {
      console.log(`error ${e}`);
    }
  };

  const getFilterData = async () => {
    try {
      let filterData = await AsyncStorage.getItem('filterData');
      filterData = JSON.parse(filterData);

      if (filterData) {
        setFilterData(filterData);
        getAnomalyData(
          filterData[0].Sort,
          filterData[0].Date,
          filterData[0].Rows,
          filterData[0].Sensor,
        );
      }
    } catch (e) {
      console.log(`error ${e}`);
    }
  };

  //on first mount, fetch data.
  useEffect(() => {
    loadFilterData(pickerSort, pickerDate, pickerRows, pickerSensor);
    //console.log(filterData);
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
      //loadFilterData();
      //console.log(filterData);
      getFilterData();
      //console.log('ehhh' + filterData[0].Date);
      //loadFilterData();
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
      <Text style={[styles.title, textColor, {marginRight: 50}]}>{name}</Text>
      <Text style={[styles.title, textColor, {marginRight: 50}]}>
        {datetime.slice(0, 16)}
      </Text>
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
  /*
  const anomalyFilterSort = option => {
    pickerSort[0] = option;
    setPickerSort(pickerSort);

    console.log(pickerSort);
    //console.log('LOOP??' + pickerVal);
  };

  const anomalyFilterDate = option => {
    pickerDate[0] = option;
    setPickerDate(pickerDate);

    //console.log(pickerVal);
    //console.log('LOOP??' + pickerVal);
  };

  const anomalyFilterRows = option => {
    pickerRows[0] = option;
    setPickerRows(pickerRows);

    //console.log(pickerVal);
    //console.log('LOOP??' + pickerVal);
  };
*/
  return (
    <>
      <View style={styles.center}>
        <SafeAreaView style={styles.container}>
          <View style={{marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
              }}>
              <View style={styles.buttonTO}>
                <View style={{marginRight: 20, marginLeft: 85}}>
                  <Ionicons name="filter-sharp" size={24} color="black" />
                </View>

                <Text style={styles.buttonText}>{'Search Filter'}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignContent: 'space-between',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginLeft: 25,
              marginRight: 10,
            }}>
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
                  {'No Anomaly Data'}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>

      <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              Search Filter
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}>
              <AntDesign name="closecircle" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: 10,
              marginRight: 20,
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                marginTop: 15,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {'Location'}
            </Text>
            <Picker
              style={{height: 50, width: 170, color: '#000'}}
              dropdownIconColor="black"
              onValueChange={(itemValue, itemIndex) => {
                pickerSensor = itemValue;
                setPickerSensor(itemValue);
              }}
              selectedValue={pickerSensor}>
              <Picker.Item label="All" value="All" />
              <Picker.Item label={sensorInfo.sensor1} value="Sensor 1" />
              <Picker.Item label={sensorInfo.sensor2} value="Sensor 2" />
              <Picker.Item label={sensorInfo.sensor4} value="Sensor 4" />
            </Picker>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10,
              marginRight: 20,
              width: '100%',
              //alignItems: 'stretch',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontSize: 16,
                marginTop: 15,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {'Sort by'}
            </Text>
            <Picker
              style={{height: 50, width: 170, color: '#000'}}
              dropdownIconColor="black"
              onValueChange={(itemValue, itemIndex) => setPickerSort(itemValue)}
              selectedValue={pickerSort}>
              <Picker.Item label="Date" value="Date" />
              <Picker.Item label="Power" value="Power" />
            </Picker>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: 10,
              marginRight: 20,
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                marginTop: 15,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {'Date'}
            </Text>
            <Picker
              style={{height: 50, width: 170, color: '#000'}}
              dropdownIconColor="black"
              onValueChange={(itemValue, itemIndex) => {
                pickerDate = itemValue;
                setPickerDate(itemValue);
              }}
              selectedValue={pickerDate}>
              <Picker.Item label="Today" value="Today" />
              <Picker.Item label="This Week" value="Week" />
              <Picker.Item label="This Month" value="Month" />
              <Picker.Item label="This Year" value="Year" />
            </Picker>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: 10,
              marginRight: 20,
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                marginTop: 15,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {'Number of rows'}
            </Text>
            <Picker
              style={{
                width: 170,
                color: '#000',
              }}
              dropdownIconColor="black"
              onValueChange={(itemValue, itemIndex) => setPickerRows(itemValue)}
              selectedValue={pickerRows}>
              <Picker.Item label="10" value="10" />
              <Picker.Item label="15" value="15" />
              <Picker.Item label="25" value="25" />
              <Picker.Item label="50" value="50" />
              <Picker.Item label="100" value="100" />
              <Picker.Item label="250" value="250" />
            </Picker>
          </View>
          {/*
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: 45,
            }}>
            <Text style={{color: 'black', fontSize: 15}}>{'Sort by'}</Text>
          </View>
          */}

          <View
            style={{
              alignItems: 'stretch',
              marginLeft: 25,
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              title="Cancel"
              onPress={() => {
                setVisible(false);
              }}
              color="grey"
            />
            <Button
              title="Apply"
              onPress={() => {
                AsyncStorage.removeItem('filterData');
                setFilterData({});
                let filterData = [
                  {
                    Sort: pickerSort,
                    Date: pickerDate,
                    Rows: pickerRows,
                    Sensor: pickerSensor,
                  },
                ];
                setFilterData(filterData);
                AsyncStorage.setItem('filterData', JSON.stringify(filterData));
                getAnomalyData(
                  pickerSort,
                  pickerDate,
                  pickerRows,
                  pickerSensor,
                );
                setVisible(false);
              }}
            />
          </View>
        </View>
      </ModalPoup>
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
    width: '90%',
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
  buttonTO: {
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
});

export default AnomalyRecordScreen;
