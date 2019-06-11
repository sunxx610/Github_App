import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {BackHandler} from 'react-native'
import {NavigationActions} from 'react-navigation'

import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'
import NavigationUtil from "../navigator/NavigationUtil"
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import actions from "../action";
import {connect} from "react-redux";

type Props = {};

class HomePage extends Component<Props> {
  /*Android physical back button*/
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  /*Android physical back button*/
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  /*Android physical back button
  * need to use arrow function to bind this to use this.props
  * */
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    /*init nav is 0's routes, main nav is 1st routes
    * if main nav's index is 0, don't need deal with back button
    * */
    if (nav.routes[1].index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true
  };

  render() {
    /*children level navigator can't jump to parent level page, so save navigation in NavigationUtil to pass to children navigator*/
    NavigationUtil.navigation = this.props.navigation;
    return <DynamicTabNavigator/>
  }
}

const mapStateToProps = state => ({
  nav: state.nav
});


export default connect(mapStateToProps)(HomePage);
