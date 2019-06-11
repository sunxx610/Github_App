import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'
import DataStore from "../expand/dao/DataStore";

type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    };
    this.DataStore = new DataStore();
  }

  loadData() {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    this.DataStore.fetchData(url)
      .then(data => {
        let showData = `first data update time: ${new Date(data.timestamp)}\n${JSON.stringify((data.data))}`;
        this.setState({
          showText: showData
        })
          .catch((error) => {
            error && console.error(error.toString())
          })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DataStoreDemoPage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.searchKey = text;
            }}
          />
          <Text
            onPress={() => {
              this.loadData()
            }}
          >Get Data</Text>

        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
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
    flex: 1,
    borderColor: '#405788',
    borderWidth: 1,
    marginRight: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
