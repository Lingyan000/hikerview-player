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
        sources: [
          {
            type: "video/mp4",
            src:
              "https://cloud189-shzh-corp.oos-gdsz.ctyunapi.cn/f1c5e56c-ae90-4da0-9be4-352d18a00673?response-content-disposition=attachment%3Bfilename%3D%22%C3%A6%C2%97%C2%A0%C3%A8%C2%80%C2%BB%C3%A5%C2%AE%C2%B6%C3%A5%C2%BA%C2%ADS11E01.mp4%22&x-amz-CLIENTNETWORK=UNKNOWN&x-amz-CLOUDTYPEIN=CORP&x-amz-CLIENTTYPEIN=UNKNOWN&Signature=jark3ntGHRmrgG7ufWg1APCLhcc%3D&AWSAccessKeyId=4549320003c8aac9538f&Expires=1608908262&x-amz-limitrate=102400&response-content-type=video/mp4&x-amz-FSIZE=801538234&x-amz-UID=172982920492925&x-amz-UFID=41540312235904327",
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
  },
};
</script>

<style>
</style>