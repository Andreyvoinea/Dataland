<template>
  <div class="d-header m-0 fixed top-0 surface-900 h-4rem w-full grid align-items-center">
    <div class="col-4 text-left">
      <router-link to="/">
        <img src="@/assets/images/logos/logo_dataland_long.svg" alt="image" class="pl-3" />
      </router-link>
    </div>

    <div class="col-4">
      <slot></slot>
    </div>

    <div class="col-4 flex justify-content-end" v-if="showUserProfileDropdown">
      <UserProfileDropDown />
    </div>
  </div>
  <!-- This is a spacer div whose only purpose is to ensure that no elements get hidden behind the header -->
  <div class="h-4rem" />
</template>

<script lang="ts">
import UserProfileDropDown from "@/components/general/UserProfileDropDown.vue";
export default {
  name: "TheHeader",
  components: { UserProfileDropDown },
  props: {
    showUserProfileDropdown: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
