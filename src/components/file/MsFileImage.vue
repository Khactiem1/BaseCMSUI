<template>
  <div class="p-upload_image">
    <div class="image-item" v-for="item in lstImage" :key="item">
      <div class="image-form" :ref="`${item}_image`">
        <img v-if="item" @click="showViewer(item)" v-bind:src="fileAPI.getFileViewUrl(item)" class="image-form-style" alt="">
      </div>
      <div class="image-tool">
        <div @click="handleChoseImage(item)" class="image-tool_item tool-edit"></div>
        <div class="separate-line-upload"></div>
        <div @click="handleDeleteFile(item)" class="image-tool_item tool-delete"></div>
      </div>
    </div>
    <div class="image-item" v-if="multiple || !lstImage.length">
      <div class="image-form">
        <div @click="handleChoseImage()" class="upload-image"></div>
      </div>
      <div class="image-tool">
        <div @click="handleChoseImage()" class="image-tool_item tool-edit"></div>
      </div>
    </div>
    <input accept="image/*" @change="onFileSelected" class="separate-line-chose_image" ref="refFile" type="file">
    <!-- Modal Preview -->
    <PreviewImageModal 
      v-if="showPreview"
      :file="selectedFile"
      :aspectRatio="aspectRatio"
      :maxWidth="maxWidth"
      :maxSize="maxSize"
      :autoZoom="autoZoom"
      @cancel="closePreview"
      @confirm="confirmPreview"
    />
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, computed, ref, onBeforeUnmount } from 'vue';
import fileAPI from '@/apis/file/fileAPI';
import { showAlert } from '@/commons/globalMessage';
import PreviewImageModal from './PreviewImageModal.vue';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

const { proxy } = getCurrentInstance();
// Model hình ảnh và emit update model
const props = defineProps({
  modelValue: { required: true },
  multiple: { required: false, default: false, },
  path: { required: false, default: '', },
  aspectRatio: { type: Number, default: 1/1 }, // Tỷ lệ ảnh mong muốn (1:1, 16:9,...)
  maxWidth: { type: Number, default: 1024 }, // Kích thước nén tối đa
  maxSize: { type: Number, default: 800 * 1024 }, // Dung lượng tối đa cho phép (ví dụ: 800kb)
  autoZoom: { type: Boolean, default: false }, // autoZoom
})
const emits = defineEmits(['update:modelValue']);
const fileEdit = ref('');
const showPreview = ref(false);
const selectedFile = ref<File | null>(null);

const showViewer = (image) => {
  const me: any = proxy;
  if(me.viewerInstance){
    me.viewerInstance.destroy(); // Hủy viewerInstance
    me.viewerInstance = null;
  }
  me.viewerInstance = new Viewer(me.$refs[`${image}_image`][0], {
    inline: false,
    toolbar: true,
    navbar: false,
  });
  me.viewerInstance.show();
};

onBeforeUnmount(() => {
  const me: any = proxy;
  if(me.viewerInstance){
    me.viewerInstance.destroy(); // Hủy viewerInstance
    me.viewerInstance = null;
  }
});

// Xử lý khi file được chọn
const onFileSelected = async (event: any) => {
  const me: any = proxy;
  let file = null;
  if (event.type === 'change' && event.target.files && event.target.files.length > 0) {
    file = event.target.files[0];
  }
  if (file) {
    selectedFile.value = file; // Lưu file vào biến state
    showPreview.value = true; // Hiển thị modal preview
  }
};

// Đóng modal preview
const closePreview = () => {
  const me: any = proxy;
  showPreview.value = false;
  selectedFile.value = null;
  me.$refs['refFile'].value = null;
};

// Xác nhận modal preview
const confirmPreview = async (processedFile: File) => {
  const me: any = proxy;
  showPreview.value = false;
  me.$ms.commonFn.mask();
  const result: any = await fileAPI.uploadFile(processedFile, me.path);
  me.$ms.commonFn.unmask();
  selectedFile.value = null;
  me.$refs['refFile'].value = null;
  if (result?.Success && result?.Data) {
    if (!fileEdit.value) {
      const lstFile = lstImage.value;
      lstFile.push(result.Data);
      emits('update:modelValue', lstFile.join(';'));
    } else {
      const lstFile = lstImage.value;
      const idx = lstFile.findIndex(_ => _ === fileEdit.value);
      if (idx !== -1) {
        lstFile[idx] = result.Data;
        emits('update:modelValue', lstFile.join(';'));
      }
      fileEdit.value = '';
    }
  }
};

/**
 * Danh sách các ảnh
 */
const lstImage = computed<any []>(() => {
  const me: any = proxy;
  if(me.modelValue){
    return me.modelValue.split(';');
  }
  return [];
});

/**
 * Xử lý chọn hoặc sửa ảnh
 */
const handleChoseImage = (image: any = '') => {
  const me: any = proxy;
  if(me.$refs['refFile']){
    me.$refs['refFile'].click();
    if(image){
      fileEdit.value = image;
    }
  }
};

/**
 * Xoá file
 */
const handleDeleteFile = async (image) => {
  const me: any = proxy;
  if(image){
    const result = await showAlert(me.$t('i18nCommon.AskDeleteRecord'));
    if(result){
      const lstFile = lstImage.value.filter(_ => _ != image);
      emits('update:modelValue', lstFile.join(';'));
    }
  }
};

</script>

<style lang="scss" scoped>
.p-upload_image{
  display: flex;
  flex-wrap: wrap;
  .image-item{
    margin-right: 12px;
    margin-bottom: 12px;
  }
}
.image-form{
  min-width: 120px;
  min-height: 120px;
  width: 120px;
  height: 120px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.image-form-style{
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  cursor: pointer;
}
.image-tool{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
}
.image-tool_item{
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background: var(--url__icon) no-repeat;
  cursor: pointer;
}
.separate-line-upload{
  height: 14px;
  width: 1px;
  background: #d4d7dc;
  margin: 0 10px;
}

.tool-edit{
  background-position: -412px -308px;
}
.tool-delete{
  background-position: -460px -308px;
}
.upload-image{
  width: 64px;
  height: 64px;
  background: var(--url__icon) no-repeat;
  background-position: -25px -448px;
  transform: scale(1.5);
  cursor: pointer;
  z-index: 0;
}
.separate-line-chose_image{
  width: 0;
  height: 0;
  visibility: hidden;
}
</style>