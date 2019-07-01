import Types from '../types'
import LanguageDao from "../../expand/dao/LanguageDao";

/**
 * get languages
 * @param flagKey popular || trending
 * @returns {function(*)}
 * */
export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch();
      dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey});
    } catch (e) {
      console.error(e)
    }
  }
}