import { createStore } from 'vuex'

export default createStore({
  state: {
    errorInfo: {
      code: null,
      message: ''
    }
  },
  mutations: {
    setErrorInfo(state, { code, message = '' }) {
      state.errorInfo.code = code;
      state.errorInfo.message = message;
    },
    clearErrorInfo(state) {
      state.errorInfo.code = null;
      state.errorInfo.message = '';
    }
  },
  actions: {
    setError({ commit }, errorData) {
      commit('setErrorInfo', errorData);
    },
    clearError({ commit }) {
      commit('clearErrorInfo');
    }
  },
  getters: {
    errorCode: state => state.errorInfo.code,
    errorMessage: state => state.errorInfo.message
  }
})
