import {AsyncStorage} from 'react-native'

import langs from '../../res/data/langs'
import keys from '../../res/data/keys'

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'};
export default class LanguageDao {
  /**
   * @param flag popular || trending
   * */
  constructor(flag) {
    this.flag = flag;
  }

/**
 * get popular languages or trending keys(tabs)
 * @return {Promise<any> | Promise}
 * */
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
          this.save(data);
          resolve(data);
        } else {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(error)
          }
        }
      })
    })
  }

  /**
   * save popular languages or trending keys(tabs)
   * @param objectData
   * */
  save(objectData) {
    let stringData = JSON.stringify(objectData);
    AsyncStorage.setItem(this.flag, stringData, (error, result) => {

    })
  }
}