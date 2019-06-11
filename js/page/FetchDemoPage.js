import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'

type Props = {};
export default class FetchDemoPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }

  loadData() {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
  }

  loadData2() {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Network no response.');
      })
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
      .catch(e => {
        this.setState({
          showText: e.toString()
      })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemoPage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.searchKey = text;
            }}
          />

          <Button
            title={'Get'}
            onPress={() => {
              this.loadData2()
            }}
          />
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
