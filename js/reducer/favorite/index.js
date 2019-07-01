import Types from '../../action/types'
/**
* favorite:{
*   popular:{
*     projectModels: [],
*     isLoading: false
*   },
*   projectModels:{
*     items:[],
*     isLoading: false
*   }
* }
*
* */
const defaultState = {};
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.FAVORITE_LOAD_DATA://loading favorite data
      return {
        ...state,
        /*dynamic storeName*/
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,//is loading
        }
      };
    case Types.FAVORITE_LOAD_SUCCESS://loading favorite data success
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          isLoading: false,
        }
      };
    case Types.FAVORITE_LOAD_FAIL://loading favorite data failed
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false
        }
      };
    default:
      return state;
  }
}