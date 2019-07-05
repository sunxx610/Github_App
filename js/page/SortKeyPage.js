import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Alert,
  TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
import NavigationUtil from '../navigator/NavigationUtil'
import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";
import GlobalStyles from "../res/styles/GlobalStyles";

type Props = {};

class SortKeyPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: (e) => this.onBackPress(e)
    });
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      checkedArray: SortKeyPage._keys(this.props)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, null, prevState);
    if (prevState.keys !== checkedArray) {
      return {
        checkedArray: checkedArray
      }
    }
    return null;
  }

  /*Android hardware back button*/

  /*add BackHandler listener */
  componentDidMount() {
    this.backPress.componentDidMount();
    //if tabs in props is empty, load tabs from local storage
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
  }

  /*remove BackHandler listener */
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * get checked tabs
   * @param props
   * @param state used when remove tabs
   * @return {*}
   * @private
   * */
  static _keys(props, state) {
    console.log('props', props, 'state', state)
    //if checkedArray existed in state, return checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    //else get checkedArray from original data
    const flag = SortKeyPage._flag(props);//language_dao_language||language_dao_key
    //all data
    let dataArray = props.language[flag] || [];
    //data checked
    let keys = [];
    for (let i = 0, l = dataArray.length; i < l; i++) {
      let data = dataArray[i];
      if (data.checked) keys.push(data);
    }
    return keys;//checked items
  }

  static _flag(props) {
    const {flag} = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
  }

  onBackPress(e) {
    this.onBack();
    return true;
  }

  onSave(hasChecked) {
    console.log('IS equal',SortKeyPage._keys(this.props),this.state.checkedArray)
    if (!hasChecked) {
      //return if didn't change the sort
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation);
        return;
      }
    }
    //save resorted data
    this.languageDao.save(this.getSortResult());
    //get resorted data
    //update local data

    const {onLoadLanguage} = this.props;
    //update store
    onLoadLanguage(this.params.flag);
    NavigationUtil.goBack(this.props.navigation);
  }

  /**
   * Get resorted tabs
   * sortResultArray: sorted result array
   * originalCheckedArray: unsorted checked array
   * this.state.checkedArray: sorted checked array
   * method: traversing originalCheckedArray, find each index for originalCheckedArray element in sortResultArray, then replace sortResultArray[index] with this.state.checkedArray:[i]
   * @returns {Array}
   */
  getSortResult() {
    const flag = SortKeyPage._flag(this.props);
    //copy from original data and then reorder
    let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
    //get original checked data before reorder
    const originalCheckedArray = SortKeyPage._keys(this.props);
    //traversing original data array
    for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
      let item = originalCheckedArray[i];
      //find replace item index
      let index = this.props.language[flag].indexOf(item);
      //replace
      //this.state.checkedArray: sorted checked array
      sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
    return sortResultArray;
  }

  onBack() {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
      Alert.alert('Reminder', 'Do you want to save edit before leave？',
        [
          {
            text: 'No save', onPress: () => {
              NavigationUtil.goBack(this.props.navigation)
            }
          }, {
          text: 'Save', onPress: () => {
            this.onSave(true);
          }
        }
        ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  render() {
    const {theme} = this.params;
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? 'Sort languages' : 'Sort tabs';
    /*tab title & status bar*/
    let navigationBar = <NavigationBar
      title={title}
      style={theme.styles.navBar}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton('Save', () => this.onSave())}
    />;
    return <SafeAreaViewPlus
      style={GlobalStyles.root_container}
      topColor={theme.themeColor}
    >
      {navigationBar}
      <SortableListView
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} {...this.params}/>}
      />
    </SafeAreaViewPlus>
  }
}

class SortCell extends Component {
  render() {
    const {theme} = this.props;
    return <TouchableHighlight
      underlayColor={'#eee'}
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}>
      <View style={{marginLeft: 10, flexDirection: 'row'}}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10, color: theme.themeColor}}/>
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const mapPopularStateToProps = state => ({
  /*language reducer's keys*/
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: .3,
    backgroundColor: 'darkgray'
  },
  hidden: {
    height: 0
  },
  item: {
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  }
});
