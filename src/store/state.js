import { playMode } from 'common/js/config'
import { loadSearch, loadFavorite, loadPlay } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放的是哪首歌
  disc: {}, // 歌单对象
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
  readyPlay: false
}

export default state