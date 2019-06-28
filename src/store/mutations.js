import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.isFullScreen = flag;
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_DISC_LIST](state, disclist) {
    state.disclist = disclist;
  },
  [types.SET_RANK_LIST](state, ranklist) {
    state.ranklist = ranklist;
  },
  [types.SET_SEARCH_HISTORY](state, list) {
    state.searchHistory = list;
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history;
  },
};

export default mutations;
