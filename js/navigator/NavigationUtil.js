/*Global navigation jump tool class*/
export default class NavigationUtil {
  /*Go to specific page
  * @params params:params
  * @params page: which page to go
  * */
  static goPage(params, page) {
    const navigation = NavigationUtil.navigation;
    /*children level router can't jump to parent level router*/
    //const {navigation} = params;
    if (!navigation) {
      console.log('NavigationUtil.navigation can\'t be null.')
    }
    navigation.navigate(
      page,
    );
  }

  /*Return to previous page
  * @params navigation
  * */
  static goBack(navigation) {
    navigation.goBack();
  }

  /*Reset to Home Page
  * @params params
  * */
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}