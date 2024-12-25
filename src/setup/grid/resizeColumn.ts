import { getCurrentInstance } from 'vue';

export const useColumnResize = () => {
  const { proxy }: any = getCurrentInstance();

  /**
   * 
   * Hàm đóng mở form tìm kiếm
   */
  const handleShowFilter = async (event: any = null, col: any = null, isRelaodFilter = false) => {
    const me: any = proxy;
    try {
      if(event){
        const widthFilter = 350 + 80; // width của component filter + 80 là width của left menu
        const rect = event.srcElement.getBoundingClientRect()
        me.setPositionFilter.top = rect.top + 25;
        if(rect.left < widthFilter){
          me.setPositionFilter.left = widthFilter - (346 - rect.width);
        }
        else {
          me.setPositionFilter.left = rect.left - (346 - rect.width);
        }
      }
      if(!me.isShowFilter && col){
        me.colFilter = col;
      }
      me.isShowFilter = !me.isShowFilter;
      if(isRelaodFilter){
        me.gridInfo.pageIndex = 1;
        me.loadData();
      }
    } catch (e) {
      console.log(e);
    }
  }

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
    handleShowFilter,
  };
};
