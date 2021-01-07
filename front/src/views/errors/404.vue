<template>
  <ErrorPage :code="404"></ErrorPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorPage from './home.vue'
export default defineComponent({
  name: 'Error404',
  components: { ErrorPage },
})
</script>