// import { showInfo } from '@/commons/globalMessage_APU';
/**
 * Xử lý lỗi toàn cục trên chương trình
 * (Dùng cho các lỗi chưa xác định được hết vùng cần try catch)
 * @param {*} error 
 * @param {*} vm 
 * @param {*} info 
 */
const errorHandler = (error: any, vm: any, info: any) => {
    console.log('Log tại ErrorHandle:', error);
    if(error && error.message){
        //bttu (6.9.2023): Xử lý lỗi Failed to fetch dynamically imported module
        let pattern = /Loading chunk (\S)+ failed/g;
        let pattern2 = /Failed to fetch dynamically imported module/g;
        let isChunkLoadFailed = error.message.match(pattern) || error.message.match(pattern2);
        if (isChunkLoadFailed) {
            // showInfo('Phiên bản bạn đang sử dụng là phiên bản cũ. Vui lòng nạp lại trang.').then(() => {
            //     window.location.reload();
            // });
        }
        //bttu (6.9.2023) Xử lý lỗi Unable to preload CSS
        let pattern3 = /Unable to preload CSS/g;
        if(error.message.match(pattern3)){
            // showInfo('Phiên bản bạn đang sử dụng là phiên bản cũ. Vui lòng nạp lại trang.').then(() => {
            //     window.location.reload();
            // });
        }
    }
};
  
export default errorHandler;