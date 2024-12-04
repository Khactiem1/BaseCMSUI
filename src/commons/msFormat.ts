import moment from 'moment';
import i18nGlobal from '@/i18n/i18n';
import { MSConstant } from '@/commons/wildcards';

const i18n = i18nGlobal.global;
let mo = moment;

let msFormat = {
  formatDateTimeFull(value: any, typeFormat = 'DD/MM/YYYY HH:mm:ss') {
    if (!value) {
      return '-';
    }

    let ret,
      format = typeFormat,
      dte = value;

    if (!(dte instanceof Date)) {
      dte = mo(value);
      dte = dte.toDate();
    }

    let m = mo(dte);

    ret = m.format(format);

    return ret;
  },
  formatNumber(number: any){
    if(!this.isNumber(number + '')) return number;
    if((number || number === 0)){
      let intPart = Math.trunc(number) + ''; 
      const floatPart = Number((number - Number(intPart)).toFixed(5));
      intPart = "" + intPart;
      if (intPart.length > 3) {
        const mod = intPart.length % 3;
        let output = mod > 0 ? intPart.substring(0, mod) : "";
        for (let i = 0; i < Math.floor(intPart.length / 3); i++) {
          if (mod == 0 && i == 0)
            output += intPart.substring(mod + 3 * i, mod + 3 * i + 3);
          else output += "." + intPart.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return floatPart !== 0 ? output + ',' + (floatPart + '').slice( 2 ) : output;
      } else return floatPart !== 0 ? intPart + ',' + (floatPart + '').slice( 2 ) : intPart;
    }
    else return '';
  },
  isNumber(str: string) {
    return !isNaN(Number(str));
  },
  validateEmail(email: any){
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //eslint-disable-line
    return regex.test(email);
  },
  formatEnum(value: any, enumName: any) {
    if (typeof value == 'number' || value || typeof value == 'boolean') {
      let formatValue: any = Number(value);
      if(typeof value == 'boolean'){
        formatValue = value;
      }
      if (Number.isNaN(formatValue)) {
        formatValue = value;
      }
      if (enumName) {
        let enumObj = MSConstant[enumName];
        if (enumObj) {
          if (!Object.keys(enumObj)) {
            return '';
          }
          let key = Object.keys(enumObj).find(k => enumObj[k] === formatValue);
          if (key) {
            // let rs = i18nEnum[enumName];
            // if (rs) {
            //   let text = rs[key];
            //   return text;
            // }
            return i18n.t(`i18nEnum.${enumName}.${key}`);
          } else {
            return '';
          }
          // 	// return this.$t('i18nEnum.' + key + '');
        } else {
          return '';
        }
      } else {
        return '';
      }
    }
    return '';
  },
}
export { msFormat };
