import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, Butto, AsyncStorage} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'

type Props = {};
const KEY = 'save_key';
export default class AsyncStorageDemoPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorageDemoPage</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
        />
        <View style={styles.inputContainer}>
          <Text onPress={() => {
            this.doSave();
          }}>
            Save
          </Text>
          <Text onPress={() => {
            this.doRemove();
          }}>
            Delete
          </Text>
          <Text onPress={() => {
            this.getData();
          }}>
            getData
          </Text>
        </View>
        <Text>
          {this.state.showText}
        </Text>
      </View>
    );
  }

  async doSave() {
    AsyncStorage.setItem(KEY, this.value, error => {
      error && console.log(error.toString());
    })
  }

  async doRemove() {
    AsyncStorage.removeItem(KEY, error => {
      error && console.log(error.toString());
    })
  }

  async getData() {
    AsyncStorage.getItem(KEY, (error, value) => {
      this.setState({
        showText: value
      });
      console.log(value);
      error && console.log(error.toString());
    })
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: '#405788',
    borderWidth: 1,
    marginRight: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
