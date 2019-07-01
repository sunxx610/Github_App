import Types from '../../action/types'
/*
* popular:{
*   java:{
*     items: [],
*     isLoading: false
*   },
*   ios:{
*     items:[],
*     isLoading: false
*   }
* }
*
* */
const defaultState = {};
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH_SUCCESS://drop down to refresh success
      return {
        ...state,
        /*dynamic storeName*/
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,//original data(30 pieces)
          projectModels: action.projectModels,//each page display data(10 pieces)
          isLoading: false,//is refreshing
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }

      };
    case Types.POPULAR_REFRESH://drop down to refresh
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        }
      };
    case Types.POPULAR_REFRESH_FAIL://drop down to refresh failed
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false
        }
      };
    case Types.POPULAR_LOAD_MORE_SUCCESS://pull up to load more success
      return {
        ...state,
        /*dynamic storeName*/
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      };
    case Types.POPULAR_LOAD_MORE_FAIL://pull up to load more failed
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex
        }
      };
    case Types.POPULAR_FLUSH_FAVORITE://refresh when favorite change
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels
        }
      };
    default:
      return state;
  }
}