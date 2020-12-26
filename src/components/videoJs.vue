<template>
  <video
    id="video"
    ref="video"
    class="video-js vjs-default-skin vjs-big-play-centered"
    style="height: 100vh; width: 100vw"
    controls
    preload="none"
  ></video>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
export default {
  props: {
    sources: {
      type: Array,
      default: [
        {
          type: "video/mp4",
          src: "http://vjs.zencdn.net/v/oceans.mp4",
        },
      ],
    },
  },
  mounted() {
    this.myPlayer = videojs(
      "video",
      {
        //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: true,
        //自动播放属性,muted:静音播放
        muted: false,
        autoplay: true,
        //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: "auto",
        // url
        // poster: 'https://static.shuxuejia.com/img/video_image.png', // 封面图片
        sources: this.sources,
        playbackRates: [0.5, 1, 1.5, 2], //倍速播放
      },
      function onPlayerReady() {
        videojs.log("Your player is ready!"); // 比如： 播放量+1请求

        this.on("ended", function () {
          videojs.log("Awww...over so soon?!");
        });
      }
    );
  },
};
</script>

<style>
</style>