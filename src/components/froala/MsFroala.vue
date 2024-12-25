<template>
	<div class="froala-content">
		<froala
      class="froala-editor"
      v-if="config"
      :tag="'textarea'" 
      :config="config"
      v-model:value="computedValue">
    </froala>
    <!-- <froalaView v-model:value="content"></froalaView> -->
  </div>
</template>

<script lang="ts">
//Import Froala Editor 
import 'froala-editor/js/plugins.pkgd.min.js';
//Import third party plugins
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/languages/vi'; // Import file ngôn ngữ
// Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import imageCompression from 'browser-image-compression';
import { computed, defineComponent, getCurrentInstance, ref, onMounted } from 'vue';
import fileAPI from '@/apis/file/fileAPI';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
    },
    /**
     * Đường dẫn hình ảnh muốn lưu
     */
    pathImage: {
      type: String,
      default: '',
    },
    /**
     * Đường dẫn video muốn lưu
     */
    pathVideo: {
      type: String,
      default: '',
    },
    maxSizeImage: { 
      type: Number, 
      default: 800 * 1024 
    }, // Dung lượng tối ảnh đa cho phép (ví dụ: 800kb)
    maxSizeVideo: { 
      type: Number, 
      default: 50 * 1024 * 1024
    }, // Dung lượng tối video đa cho phép (ví dụ: 50MB)
  },
	setup(props, { emit }) {
		const { proxy } : any = getCurrentInstance();
    const config = ref(null); // Config froala

    /**
     * Init config froala
     */
    onMounted(() => {
      const me: any = proxy;
      config.value = {
        language: localStorage.getItem("Lang") ? localStorage.getItem("Lang") : 'vi',
        placeholderText: proxy.$t('i18nCommon.EnterDocument'),
        heightMin: 250, // Chiều cao tối thiểu 400px
        videoMaxSize: me.maxSizeVideo,
        events: {
          'image.beforeUpload': handleUploadImage, // Xử lý upload hình ảnh thủ công
          'video.beforeUpload': handleUploadVideo, // Xử lý upload video thủ công
        }
      };
    });

    /**
     * Xử lý upload hình ảnh
     */
    const handleUploadImage = function (files: File[]){
      const me: any = proxy;
      if (files.length) {
        me.$ms.commonFn.mask();
        compressImage(files[0], me.maxSizeImage).then((file) => {
          if(file){
            fileAPI.uploadFile(file, me.pathImage).then((result) => {
              if (result?.Success && result?.Data){
                this.image.insert(fileAPI.getFileViewUrl(result.Data));
              }
            })
            .catch(error => {
              console.error('Lỗi tải hình ảnh:', error);
            })
            .finally(() => {
              me.$ms.commonFn.unmask();
            });
          }
        }).catch(() => {
          me.$ms.commonFn.unmask();
        })
      }
      return false; // Ngăn không cho Froala xử lý upload mặc định
    };

    /**
     * Xử lý upload video
     */
    const handleUploadVideo = function (files: File[]){
      const me: any = proxy;
      if (files.length) {
        me.$ms.commonFn.mask();
        fileAPI.uploadFile(files[0], me.pathVideo).then((result) => {
          if (result?.Success && result?.Data){
            this.video.insert(`
              <video src="${fileAPI.getFileViewUrl(result.Data)}" 
                width="300" 
                height="300" 
                controls 
                class="fr-draggable"
              >
                Video không thể phát. Vui lòng kiểm tra lại!
              </video>
            `);
          }
        })
        .catch(error => {
          console.error('Lỗi tải video:', error);
        })
        .finally(() => {
          me.$ms.commonFn.unmask();
        });
      }
      return false; // Ngăn không cho Froala xử lý upload mặc định
    };

    /**
     * Nén ảnh
     * @param file File ảnh cần nén
     * @param maxSizeKB Dung lượng tối đa (KB)
     * @param initialQuality Chất lượng ảnh ban đầu (0-1)
     * @returns File đã nén
     */
    const compressImage = async (
      file: File,
      maxSizeKB, // Dung lượng tối đa (KB)
      initialQuality = 0.9 // Chất lượng ảnh ban đầu
    ): Promise<File> => {
      let quality = initialQuality;
      let compressedFile = file;
      if(compressedFile.size <= maxSizeKB * 1024) return compressedFile;
      do {
        const options = {
          maxSizeMB: maxSizeKB / 1024, // Chuyển đổi từ KB sang MB
          initialQuality: quality, // Chất lượng hiện tại
          useWebWorker: true, // Sử dụng Web Worker
        };
        try {
          // Nén file
          compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.error('Lỗi khi nén ảnh:', error);
          throw error; // Bắn lỗi để xử lý bên ngoài nếu cần
        }

        // Giảm chất lượng ảnh
        quality -= 0.1;

        // Thoát nếu chất lượng quá thấp
        if (quality <= 0.1) {
          break;
        }
      } while (compressedFile.size > maxSizeKB * 1024); // Kiểm tra nếu kích thước lớn hơn maxSizeKB

      return compressedFile;
    };

    /**
     * Giá trị v-model
     */
    const computedValue = computed({
      get() {
        props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

		return {
      config,
      computedValue,
		};
	},
});
</script>

<style lang="scss" scoped>
.froala-content, .froala-editor{
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
:deep(.fr-box){
  width: 100%;
  height: 100%;
}
.froala-content {
  :deep(.fr-wrapper){
    max-height: calc(100% - 100px); /* Chiều cao tối đa cho phần soạn thảo */
    overflow-y: auto; /* Cho phép cuộn theo trục Y */
    overflow-x: hidden; /* Ẩn cuộn ngang */
  }
}
</style>
