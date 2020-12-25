<template>
  <div class="home">
    <videoJs />
  </div>
</template>

<script>
// @ is an alias to /src
import videoJs from "@/components/videoJs.vue";

export default {
  name: "Home",
  components: {
    videoJs,
  },
};
</script>
