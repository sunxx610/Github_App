import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import {onThemeChange} from "../action/theme";


const THEME_COLOR = '#678';

type Props = {};

class MyPage extends Component<Props> {
  getRightButton() {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {

        }}
      >
        <View style={{padding: 5, marginRight: 8}}>
          <Feather
            name={'search'}
            size={24}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  getLeftButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8, paddingLeft: 12}}
      onPress={callBack}
    >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: 'white'}}
      />
    </TouchableOpacity>
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'MyPage'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={this.getRightButton()}
      leftButton={this.getLeftButton()}
    />;
    return (
      /*fit full screen phones*/
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>MyPage</Text>
      </View>
    );

  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  onThemeChange: (theme) => dispatch(onThemeChange(theme))
});
export default connect(mapStateToProps, mapDispatchToProps)(MyPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  }
});

