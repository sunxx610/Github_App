import Types from '../../action/types';

const defaultState = {
  showText: 'Search',
  items: [],//original data
  isLoading: false,
  projectModels: [],//display data
  hideLoadingMore: true,//default hide loading more
  showBottomButton: false,//if search key is not existed in popular tabs, show add button
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.SEARCH_REFRESH://search data refresh
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton: false,
        showText: 'Cancel',
      };
    case Types.SEARCH_REFRESH_SUCCESS://Get data successful
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: false,
        showBottomButton: action.showBottomButton,
        items: action.items,
        projectModels: action.projectModels,
        pageIndex: action.pageIndex,
        showText: 'Search',
        inputKey: action.inputKey
      };
    case Types.SEARCH_FAIL://push down to refresh failed
      return {
        ...state,
        isLoading: false,
        showText: 'Search',
      };
    case Types.SEARCH_CANCEL://Search cancel
      return {
        ...state,
        isLoading: false,
        showText: 'Search',
      };
    case Types.SEARCH_LOAD_MORE_SUCCESS://pull up to load more successful
      return {
        ...state,//Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        projectModels: action.projectModels,
        hideLoadingMore: false,
        pageIndex: action.pageIndex,
      };
    case Types.SEARCH_LOAD_MORE_FAIL://pull up to load more failed
      return {
        ...state,//Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        hideLoadingMore: true,
        pageIndex: action.pageIndex,
      };
    default:
      return state;
  }

}