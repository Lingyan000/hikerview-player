<template>
  <video
    id="video"
    ref="video"
    class="video-js vjs-default-skin vjs-big-play-centered"
    controls
    preload="none"
  ></video>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
export default {
  mounted() {
    const [width, height] = this.getWindowSize();
    console.log(height);
    this.myPlayer = videojs(
      "video",
      {
        //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: true,
        //自动播放属性,muted:静音播放
        muted: true,
        autoplay: true,
        //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: "auto",
        //设置视频播放器的显示宽度（以像素为单位）
        width,
        //设置视频播放器的显示高度（以像素为单位）
        height,
        // url
        // poster: 'https://static.shuxuejia.com/img/video_image.png', // 封面图片
        sources: [
          {
            src:
              "https://vt1.doubanio.com/202012231456/e436860b4a7c2128aaf7c2cb03bfc3ca/view/movie/M/402700021.mp4",
          },
        ],
        playbackRates: [0.5, 1, 1.5, 2], //倍速播放
      },
      function onPlayerReady() {
        videojs.log("Your player is ready!"); // 比如： 播放量+1请求

        this.on("ended", function () {
          videojs.log("Awww...over so soon?!");
        });
      }
    );
    window.addEventListener("resize", () => this.videoResize(), false);
  },
  methods: {
    videoResize() {
      const vid = document.getElementById("video");
      if (vid) {
        const [width, height] = this.getWindowSize();
        vid.style.width = width + "px";
        vid.style.height = height + "px";
      }
    },
    getWindowSize() {
      const { offsetWidth, offsetHeight } = document.documentElement;
      const { innerHeight } = window; // innerHeight will be blank in Windows system
      return [
        offsetWidth,
        innerHeight > offsetHeight ? offsetHeight : innerHeight,
      ];
    },
  },
};
</script>

<style>
</style>