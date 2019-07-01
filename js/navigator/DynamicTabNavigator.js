import React, {Component} from 'react';
import {createBottomTabNavigator,createAppContainer} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'
import EventBus from 'react-native-event-bus'

import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import EventTypes from "../util/EventTypes";

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
    return this.Tabs = createAppContainer(createBottomTabNavigator(tabs, {
        tabBarComponent: props => {
          return <TabBarComponent theme={this.props.theme} {...props}/>
        }
      }
    ))
  }

  render() {
    const Tab = this._tabNavigator();//react-navigation 3 required set up app container
    /*setup event bus to detect onFavorite change to synchronize favorite status in each tab*/
    return <Tab
      onNavigationStateChange={(prevState, newState, action) => {
        EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
          from: prevState.index,
          to: newState.index
        })
      }}
    />
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
      activeTintColor={this.props.theme.themeColor}
    />
  }
}

const mapStateToProps = state => ({
  /*state:[store state].[theme reducer].[theme attribute]*/
  theme: state.theme.theme
});

/*Redux step3: connect React components and Redux store*/
export default connect(mapStateToProps)(DynamicTabNavigator);
