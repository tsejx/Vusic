import { playMode } from 'common/js/config'
import { loadSearchHistroy } from 'common/js/cache'

const state = {
    // 最近查看歌手信息
    singer: {},
    // 歌曲播放状态
    playing: false,
    // 播放器全屏
    isFullScreen: false,
    // 播放列表
    playlist: [],
    // 播放序列
    sequenceList: [],
    // 播放模式
    mode: playMode.sequence,
    // 当前播放歌曲索引
    currentIndex: -1,
    // 歌单列表
    disclist: [],
    // 榜单列表
    ranklist: [],
    // 搜索历史列表
    searchHistory: loadSearchHistroy(),
}

export default state