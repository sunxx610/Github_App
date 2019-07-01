import {AsyncStorage,} from 'react-native';
import {ThemeFlags} from "../../res/styles/ThemeFactory";
import ThemeFactory from "../../res/styles/ThemeFactory";

const THEME_KEY = 'theme_key';
export default class ThemeDao {

    /**
     * Get current theme
     * @returns {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
              console.log('>>>>>>>>>>>>>>>><<<<<<<<<<<<<<if has theme',result)
              if (error) {
                    reject(error);
                    return;
                }
                if (!result) {//no saved theme,set to default
                    this.save(ThemeFlags.Default);
                    result = ThemeFlags.Default;
                }
                resolve(ThemeFactory.createTheme(result))
            });
        });
    }

    /**
     * save theme flag
     * @param themeFlag
     */
    save(themeFlag) {
      //save key:THEME_KEY, content: themeFlag
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error => {
        }))
    }
}
