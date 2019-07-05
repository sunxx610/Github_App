import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'

import NavigationBar from '../common/NavigationBar'
import actions from "../action";
import {MORE_MENU} from "../common/MORE_MENU";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import CustomKeyPage from "./CustomKeyPage";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

type Props = {};

class MyPage extends Component<Props> {
  onClick(menu) {
    const {theme} = this.props;
    let RouteName, params = {theme};
    switch (menu) {
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
      case MORE_MENU.Custom_Theme:
        const {onShowCustomThemeView} = this.props;
        onShowCustomThemeView(true);
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.CodePush:
        RouteName = 'CodePushPage';
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }

  getItem(menu) {
    const {theme} = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }

  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'MyPage'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;
    return (
      /*fit full screen phones*/
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView
          veritcal
        >
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.onClick(MORE_MENU.About)
            }}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{marginRight: 10, color: theme.themeColor}}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{marginRight: 10, alignSelf: 'center', color: theme.themeColor}}
            />
          </TouchableOpacity>
          {/*Trending management*/}
          <Text style={styles.groupTitle}>Trending management</Text>
          {/*Custom language*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyles.line}></View>
          {/*Language sort*/}
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*Popular management*/}
          <Text style={styles.groupTitle}>Popular Management</Text>
          {/*Custom tab*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyles.line}></View>
          {/*Custom tab sort*/}
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyles.line}></View>
          {/*Custom tab remove*/}
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*Setting*/}
          <Text style={styles.groupTitle}>Setting</Text>
          {/*Custom theme*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line}></View>
          {/*About author*/}
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}></View>
          {/*Feedback*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line}/>
          {/*Update*/}
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );

  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
});
export default connect(mapStateToProps, mapDispatchToProps)(MyPage);

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});

