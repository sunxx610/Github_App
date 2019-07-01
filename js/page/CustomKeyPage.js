import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert
} from 'react-native';
import {connect} from 'react-redux'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";

type Props = {};

class CustomKeyPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: (e) => this.onBackPress(e)
    });
    /*detect tabs select && un-select*/
    this.changeValues = [];
    /*justify if is remove key page*/
    this.isRemoveKey = !!this.params.isRemoveKey;
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      keys: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState),
      }
    }
    return null;
  }

  /*Android hardware back button*/

  /*add BackHandler listener */
  componentDidMount() {
    this.backPress.componentDidMount();
    if (CustomKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }

  /*remove BackHandler listener */
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * get tabs
   * @param props
   * @param original used when remove tabs,if get original tabs from props
   * @param state used when remove tabs
   * @return {*}
   * @private
   * */
  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params;
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
//if state's keys is empty, get data from props
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
        return {//no edit props, copy new props
          ...val,
          checked: false
        };
      });
    } else {
      /*language{languages:[],keys:[]}*/
      return props.language[key];
    }
  }

  onBackPress(e) {
    this.onBack();
    return true;
  }

  onSave() {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack(this.props.navigation);
      return;
    }
    let keys;
    if(this.isRemoveKey){//remove tabs
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], "name");
      }
    }
    //update local data
    this.languageDao.save(keys||this.state.keys);
    const {onLoadLanguage} = this.props;
    //update store
    onLoadLanguage(this.params.flag);
    NavigationUtil.goBack(this.props.navigation);
  }

  onClick(data, index) {
    data.checked = !data.checked;
    ArrayUtil.updateArray(this.changeValues, data);
    this.state.keys[index] = data;//update state to render
    this.setState({
      keys: this.state.keys
    })
  }

  onBack() {
    if (this.changeValues.length > 0) {
      Alert.alert('Reminder', 'Do you want to save the edit before leave?',
        [
          {
            text: 'No save', onPress: () => {
              NavigationUtil.goBack(this.props.navigation)
            }
          },
          {
            text: 'Save', onPress: () => {
              this.onSave();
            }
          }
        ])
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  renderView() {
    let dataArray = this.state.keys;
    if (!dataArray || dataArray.length === 0) return;
    let len = dataArray.length;
    let views = [];
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < len ? this.renderCheckBox(dataArray[i + 1], i + 1) :
              <View style={{flex: 1, padding: 10}}/>}{/*Placeholder*/}
          </View>
          <View style={styles.line}/>
        </View>
      )
    }
    return views;
  }

  _checkedImage(checked) {
    const {theme} = this.params;
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{color: theme.themeColor}}
    />
  }

  renderCheckBox(data, index) {
    return <CheckBox
      style={{flex: 1, padding: 10}}
      onClick={() => this.onClick(data, index)}
      isChecked={data.checked}
      leftText={data.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
    />
  }

  render() {
    const {theme} = this.params;
    let title = this.isRemoveKey ? 'Remove tabs' : 'Custom tabs';
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? 'Custom languages' : title;
    let rightButtonTitle = this.isRemoveKey ? 'Remove' : 'Save';
    /*tab title & status bar*/
    let navigationBar = <NavigationBar
      title={title}
      style={theme.styles.navBar}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
    />;
    return <View style={styles.container}>
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}

const mapPopularStateToProps = state => ({
  /*language reducer's keys*/
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row'
  },
  line: {
    flex: 1,
    height: .3,
    backgroundColor: 'darkgray'
  }
});
