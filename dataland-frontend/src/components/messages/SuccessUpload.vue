<template>
  <div>
    <Message severity="success" :sticky="true" :key:="messageId">
      <h4>Upload successfully executed.</h4>
      <p v-if="message">{{ message }}</p>
    </Message>
  </div>
</template>

<script lang="ts">
import Message from "primevue/message";

export default {
  name: "SuccessUpload",
  components: { Message },
  props: {
    message: {
      type: String,
      default: "",
    },
    messageId: Number,
  },
};
</script>
