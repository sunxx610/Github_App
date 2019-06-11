import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createSwitchNavigator
} from 'react-navigation'
import {connect} from 'react-redux'
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers'

import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import FetchDemoPage from '../page/FetchDemoPage'
import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage'
import DataStoreDemoPage from '../page/DataStoreDemoPage'

export const rootCom = 'Init'//set default router

/*Initial Navigator*/
const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  }
});

/*Main Navigator*/
const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      //header: null, //baned StackNavigator's Navigation Bar
    }
  },
  FetchDemoPage: {
    screen: FetchDemoPage,
    navigationOptions: {
      //header: null, //baned StackNavigator's Navigation Bar
    }
  },
  AsyncStorageDemoPage: {
    screen: AsyncStorageDemoPage,
    navigationOptions: {
      //header: null, //baned StackNavigator's Navigation Bar
    }
  },
  DataStoreDemoPage: {
    screen: DataStoreDemoPage,
    navigationOptions: {
      //header: null, //baned StackNavigator's Navigation Bar
    }
  }
});

/*Export Navigators*/
export const RootNavigator = createSwitchNavigator(
  {
    Init: InitNavigator,
    Main: MainNavigator
  },
  {
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  }
);

/*Redux step1: init middleware*/
export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

/*Redux step2: passed RootNavigator to reduxifyNavigator
* and return a new component with navigation state and dispatch as props
* */
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

/*State to Props
@params state
* */
const mapStateToProps = state => ({
  state: state.nav
});

/*Redux step3: connect React components and Redux store*/
export default connect(mapStateToProps)(AppWithNavigationState);