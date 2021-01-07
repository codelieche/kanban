<template>
  <ErrorPage :code="500"></ErrorPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorPage from './home.vue'
export default defineComponent({
  name: 'Error500',
  components: { ErrorPage },
})
</script>