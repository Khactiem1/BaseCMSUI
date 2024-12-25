<template>
	<div class="froala-content">
    <froalaView v-model:value="modelValue"></froalaView>
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
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
    },
  },
	setup(props, { emit }) {

		return {

		};
	},
});
</script>

<style lang="scss" scoped>
.froala-content{
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
