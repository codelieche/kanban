<template>
  <ErrorPage :code="403"></ErrorPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorPage from './home.vue'
export default defineComponent({
  name: 'Error403',
  components: { ErrorPage },
})
</script>