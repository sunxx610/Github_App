import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'


type Props = {};
export default class WelcomePage extends Component<Props> {
  /*Jump from WelcomePage to HomePage*/
  componentDidMount() {
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({navigation: this.props.navigation});
    }, 50);
  }

  /*clear timer: in case of window closed before timer is used*/
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>WelcomePage</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
