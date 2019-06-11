import React, {Component} from 'react';
import {createBottomTabNavigator} from 'react-navigation'
import {createAppContainer} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'
import {DeviceInfo} from 'react-native'

import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'

/*bottom navigation bar routes content*/
const TABS = {
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: 'Popular',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: 'Trending',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: 'Favorite',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: 'My',
      tabBarIcon: ({tintColor, focused}) => (
        <FontAwesome
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  }
};
type Props = {};

class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props);
    /*disable yellow warning box*/
    console.disableYellowBox = true;
  }


  _tabNavigator() {
    /*avoid theme color change caused regenerate tabs*/
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};//display tabs as requirement
    /*Dynamic tab bar label name*/
    //PopularPage.navigationOptions.tabBarLabel = 'Latest';
    /*TabBarComponent is used to manage theme color*/
    return this.Tabs = createBottomTabNavigator(tabs, {
      tabBarComponent: props => {
        return <TabBarComponent
          theme={this.props.state}
          {...props}
        />
      }
    })
  }

  render() {
    const Tab = createAppContainer(this._tabNavigator());//react-navigation 3 required set up app container
    return <Tab/>
  }
}

class TabBarComponent extends React.Component {
  constructor(props) {
    /*use this in constructor require super()
    * use this.props in constructor require super(props)*/
    super(props);
  }

  render() {
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}
    />
  }
}

const mapStateToProps = state => ({
  /*state:[store state].[theme reducer].[theme attribute]*/
  state: state.theme.theme
});

/*Redux step3: connect React components and Redux store*/
export default connect(mapStateToProps)(DynamicTabNavigator);
