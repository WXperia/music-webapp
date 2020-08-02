import { playMode } from 'common/js/config'
// import { loadSearch } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence,
  currentIndex: -1, // 当前播放的是哪首歌
  disc: {},
  topList: {},
  // searchHistory: loadSearch(),
  playHistory: [],
  favoriteList: []
}

export default state