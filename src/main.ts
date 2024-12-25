import './assets/main.css'
import './assets/icon.scss'
import './assets/crud.scss'
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/router'
import i18n from '@/i18n/i18n';
import { pluginInstall } from '@/commons/globalPlugin';
import { register } from '@/commons/globalPopup';
import { globalComponents } from '@/commons/globalComponents';
import errorHandler from '@/commons/errorHandler';
import { PromiseDialog } from 'vue3-promise-dialog';
import vClickOutSide from 'click-outside-vue3';
import VueFroala from 'vue-froala-wysiwyg';

//Add extension
import '@/commons/prototype';

const app = createApp(App)
app.use(VueFroala);
app.use(createPinia())
app.use(router)
app.use(i18n);
app.use(PromiseDialog);
app.use(vClickOutSide);
pluginInstall(app);
register(app);
globalComponents(app);

app.config.errorHandler = errorHandler;

app.mount('#app')
