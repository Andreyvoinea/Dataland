<template>
  <div class="col-12">
    <div @click="goBack" class="cursor-pointer flex align-items-center" data-test="backButton">
      <span class="material-icons text-primary">arrow_back_ios</span>
      <span class="text-primary font-semibold d-letters" title="back_button">{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BackButton",
  props: {
    label: {
      type: String,
      default: "BACK",
    },
  },
  methods: {
    /**
     * Performs a go-back operation on the vue router
     */
    goBack(): void {
      this.$router.go(-1);
    },
  },
});
</script>
