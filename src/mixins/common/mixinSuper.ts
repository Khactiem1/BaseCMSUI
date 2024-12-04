/**
 * Mixin để xử lý call method lớp cha
 */
export const mixinSuper = {
  created() {},
  methods: {
    /**
     * Gọi lên lớp cha
     */
    super(methodName: any, target: any) {
      const me = this;

      //nếu target không có hàm thì ngược lên extends
      let pa = target;
      
      //fix tối đa 10 lần thôi, dùng đệ quy dễ lỗi
      for (let k = 0; k < 10; k++) {
        let fn = pa.methods[methodName];
        if (typeof fn === 'function') {
          let args = [];
          //fix từ tham số thứ 3 vì 2 tham số đầu cố định, từ sau đó mới là tham số của hàm
          for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
          }

          return fn.apply(me, args);
        }

        if (!pa.extends) {
          break;
        }
        pa = pa.extends;
      }

      return null;
    }
  }
};
