import {onThemeChange, onThemeInit, onShowCustomThemeView} from "./theme";
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from "./popular";
import {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} from "./trending";
import {onSearch, onSearchCancel, onLoadMoreSearch} from "./search"
import {onLoadFavoriteData} from "./favorite"
import {onLoadLanguage} from "./language";

export default {
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView,
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onLoadLanguage,
  onSearch,
  onSearchCancel,
  onLoadMoreSearch
}