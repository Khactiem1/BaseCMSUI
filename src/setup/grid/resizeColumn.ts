import { getCurrentInstance } from 'vue';

export const useColumnResize = () => {
  const { proxy }: any = getCurrentInstance();

  /**
   * Thực hiện bắt đầu resizeOn
   * @param event 
   * @param col 
   */
  const resizeOn = (event: any, col: any) => {
    const me: any = proxy;
    me.colResizing = col;
    col.isResizing = true;
    col.startX = event.clientX;
    col.startWidth = Number(col.width);
    // this.resizingIndex = index;

    // Add mousemove and mouseup listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", resizeOffListener);
  };

  /**
   * resizeOffListener
   * @param e 
   */
  const resizeOffListener = (e: any) => {
    const me: any = proxy;
    resizeOff(e, me.colResizing);
  };

  /**
   * resizeOff khi nhả chuột
   * @param event 
   * @param col 
   */
  const resizeOff = (event: any, col: any) => {
    const me: any = proxy;
    col.isResizing = false;
    me.colResizing = null;

    // Remove mousemove and mouseup listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", resizeOffListener);
  };

  /**
   * Thực hiện cập nhật width
   * @param event 
   */
  const handleMouseMove = (event: any) => {
    const me: any = proxy;
    if (me.colResizing && me.colResizing.isResizing) {
      const delta = event.clientX - me.colResizing.startX;
      const newWidth = Math.max(50, me.colResizing.startWidth + delta); // Minimum width of 50px
      me.colResizing.width = newWidth;
      me.updateStickyOffset();
    }
  };

  return {
    resizeOn,
    resizeOff,
  };
};
