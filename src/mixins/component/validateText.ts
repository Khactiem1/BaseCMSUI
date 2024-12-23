/**
 * Mixin xử lý validate text
 */
export const validateText = {
  validateRule(rule, value) {
    const me = this;
    let res = true;
    if(!value){
      return res;
    }

    switch (rule) {
      case 'phoneEmail':
        res = me.validatePhoneEmail(value);
        break;
      case 'phone':
        res = me.validatePhone(value);
        break;
      case 'email':
        res = me.validateEmail(value);
        break;
      case 'password':
        res = me.validatePassword(value);
        break;
    }

    return res;
  },
  validatePhoneEmail(value) {
    try {
      return this.validatePhone(value) || this.validateEmail(value);
    } catch (e) {
      return false;
    }
  },
  validatePhone(value) {
    try {
      let oRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
      let result = value;
      if (!oRegex.test(result.trim())) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  },
  validateEmail(value) {
    try {
      let oRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let result = value;
      if (result && !oRegex.test(result.trim())) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  },
  validatePassword(value) {
    const me = this;
    let lengthPass = false;
    if (value && value.length >= 8) {
      lengthPass = true;
    }
    let textPass = false;
    let upcasePass = false;
    let lowercasePass = false;
    if (value && /[^A-Z]/g.test(value)) {
      upcasePass = true;
    }
    if (value && /[^a-z]/g.test(value)) {
      lowercasePass = true;
    }
    if (upcasePass && lowercasePass) {
      textPass = true;
    }
    let numberPass = false;
    if (value && /[^0-9]/g.test(value)) {
      numberPass = true;
    }

    return lengthPass && textPass && numberPass;
  }
};
