import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {connect} from "react-redux";

import BackPressComponent from "../common/BackPressComponent";
import CustomTheme from "./CustomTheme";
import actions from "../action";
import ThemeDao from "../expand/dao/ThemeDao";

type Props = {};

class HomePage extends Component<Props> {
  constructor(props) {
    super(props);
    this.backPress = new BackPressComponent({backPress: this.onBackPress()})
  }

  /*Android hardware back button*/

  /*add BackHandler listener */
  componentDidMount() {
    /*console.log('homepage props', this.props)*/
    this.backPress.componentDidMount();
  }

  /*remove BackHandler listener */
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
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

  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (<CustomTheme
      visible={customThemeViewVisible}
      {...this.props}
      onClose={() => onShowCustomThemeView(false)}
    />)
  }

  render() {
    /*children level navigator can't jump to parent level page, so save navigation in NavigationUtil to pass to children navigator*/
    NavigationUtil.navigation = this.props.navigation;
    return <View style={{flex: 1}}>
      <DynamicTabNavigator/>
      {this.renderCustomThemeView()}
    </View>
  }1
}

const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
});


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
