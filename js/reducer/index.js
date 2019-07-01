import {combineReducers} from 'redux'
import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import language from './language'
import search from './search'
import {rootCom, RootNavigator} from "../navigator/AppNavigator";


/*set default state*/
/**nav = {
  index: 1,
  isTransitioning: false,
  routes: [
    {key: "Init", isTransitioning: false, index: 0, routes: Array(1), routeName: "Init"},
    {key: "Main", isTransitioning: false, index: 0, routes: Array(1), routeName: "Main",}
  ]
};*/
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));//rootCom='init'

/*create navigation reducer*/
const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state);
  /*if 'nextState' is null or undefined, return state*/
  return nextState || state;
};

/*conbine reducer*/
const index = combineReducers({
  nav: navReducer,
  theme: theme,
  popular: popular,
  trending: trending,
  favorite: favorite,
  language: language,
  search: search
});
export default index;