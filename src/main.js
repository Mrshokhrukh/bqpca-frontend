import './assets/main.css';
import './assets/toast.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Toast, { POSITION, TYPE as ToastType } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(createPinia());

app.use(router);

const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  showCloseButtonOnHover: true,
  containerClassName: 'custom-toast-container',
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body',
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
  closeButton: 'button',
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  icon: true,
  iconClassName: 'custom-toast-icon',
  toastDefaults: {

    [ToastType.SUCCESS]: {
      timeout: 3000,
      icon: '✅',
    },
    [ToastType.ERROR]: {
      timeout: 8000,
      icon: '❌',
      closeButton: false,
    },
    [ToastType.INFO]: {
      timeout: 4000,
      icon: 'ℹ️',
    },
    [ToastType.WARNING]: {
      timeout: 6000,
      icon: '⚠️',
    },
  },
};


app.use(Toast, toastOptions);

app.mount('#app');
