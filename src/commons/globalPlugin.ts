import { type App } from "vue";
import { vfmPlugin } from '@/lib/vueFinalModal/Plugin';
import { msFormat } from '@/commons/msFormat';
import { MSConstant } from '@/commons/wildcards';
import commonFn from '@/commons/commonFunction';

export const pluginInstall = (app: App<Element>) => {
  app.config.globalProperties.$ms = app.config.globalProperties.$ms ? app.config.globalProperties.$ms : {};
  app.config.globalProperties.$ms.format = msFormat;
	app.config.globalProperties.$ms.constant = MSConstant;
  app.config.globalProperties.$ms.commonFn = commonFn;

  app.use(vfmPlugin);

  app.mixin({
    mounted() {
      const me = this;
      if (me.$el && !me.$el.getVueInstance){
        me.$el.getVueInstance = () => {
          return this;
        }
      }
    }
  });
}