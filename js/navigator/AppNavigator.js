import {
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation'
import {connect} from 'react-redux'
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers'

import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import CustomKeyPage from "../page/CustomKeyPage";
import SortKeyPage from "../page/SortKeyPage";
import SearchPage from "../page/SearchPage"


export const rootCom = 'Init';//set default router

/*Initial Navigator, for welcome page*/
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
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  SortKeyPage: {
    screen: SortKeyPage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
    }
  },
  SearchPage: {
    screen: SearchPage,
    navigationOptions: {
      header: null, //baned StackNavigator's Navigation Bar
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