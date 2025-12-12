import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Particles from "vue3-particles";
import VueViewer from 'v-viewer'
import axios from 'axios';
import './styles/main.scss';

// アプリケーション初期化
const app = createApp(App);

const API_KEY = process.env.VUE_APP_API_KEY;

// デフォルトヘッダーの設定
axios.defaults.headers.common['X-API-Key'] = API_KEY;

// axiosのグローバルプロパティ
app.config.globalProperties.$axios = axios;

// ベースURLを設定（全てのリクエストで共通）
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

// axiosをapi
app.provide('axios', axios);
app.provide('API_KEY', API_KEY);

app.use(router)
app.use(store)
app.use(Particles)
app.use(VueViewer)
app.mount('#app')
