import Types from '../types'
import ThemeDao from "../../expand/dao/ThemeDao";

/**
 * change theme
 * @param theme
 * @return {{type: string, theme: *}}
 */
export function onThemeChange(theme) {
  return {
    type: Types.THEME_CHANGE,
    theme: theme
  }
}

/**
 *
 * @return {Function}
 */

/*data:{
      themeColor: themeFlag,
      styles: StyleSheet.create({
        selectedTitleStyle: {
          color: themeFlag,
        },
        tabBarSelectedIcon: {
          tintColor: themeFlag,
        },
        navBar: {
          backgroundColor: themeFlag,
        }
      }),
    }*/
export function onThemeInit() {
  return dispatch => {
    new ThemeDao().getTheme().then(data => {
      dispatch(onThemeChange(data))
    })
  }
}

/**
 *
 * @param show
 * @return {{type: string, customThemeViewVisible: *}}
 */
export function onShowCustomThemeView(show) {
  return {type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show}
}