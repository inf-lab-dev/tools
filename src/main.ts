import { createApp } from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import './style.scss';

createApp(App).use(createRouter()).mount('#app');
