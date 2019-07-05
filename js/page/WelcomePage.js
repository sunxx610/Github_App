import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil'
import actions from "../action";
import {connect} from "react-redux";
import SplashScreen from 'react-native-splash-screen';

type Props = {};
class WelcomePage extends Component<Props> {
  /*Jump from WelcomePage to HomePage*/
  componentDidMount() {
    this.props.onThemeInit();
    this.timer = setTimeout(() => {
      SplashScreen.hide();
      NavigationUtil.resetToHomePage({navigation: this.props.navigation});
    }, 500);
  }

  /*clear timer: in case of window closed before timer is used*/
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);