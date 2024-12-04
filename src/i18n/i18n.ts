import i18nData from "@/i18n/i18nData";
import { createI18n } from 'vue-i18n';

try{
  if(!localStorage.getItem("Lang")){
    localStorage.setItem("Lang", "vi")
  }
}
catch{
  localStorage.setItem("Lang", "vi")
}

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: localStorage.getItem("Lang"),
  messages: i18nData,
  fallbackLocale: "vi"
})
export default i18n;