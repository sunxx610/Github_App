import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import MyPage from "./MyPage";
import actions from "../action";
import {connect} from "react-redux";


type Props = {};
class FavoritePage extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FavoritePage</Text>
        <Button
          title={'Change theme'}
          onPress={() => {
            this.props.onThemeChange('#ff9257')
          }}
        />
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);