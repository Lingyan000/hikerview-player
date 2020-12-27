<template>
  <div class="home">
    <video-player class="videoPlayer" style="height: 100vh; width: 100vw" :options="videoOptions"/>
    <el-dialog
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="请输入您的手机 IP 地址"
      :visible.sync="visible"
      width="40%"
    >
      <div style="text-align: center">
        <el-input
          ref="inAddressInput"
          v-model="ipAddress"
          placeholder="请输入 IP 地址"
          size="small"
          clearable
          autofocus
          @keyup.enter.native="confirm"
        >
          <span slot="append">:52020</span>
        </el-input>
      </div>
      <span slot="footer">
        <el-button size="mini" type="primary" @click="confirm">确认</el-button>
      </span>
      <span> </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import VideoPlayer from '@/components/VideoPlayer/index'

export default {
  name: 'home',
  data () {
    return {
      visible: true,
      ipAddress: '',
      playUrl: '',
      videoOptions: {
        language: 'zh-CN',
        autoplay: true,
        controls: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [
          {
            src: 'http://vjs.zencdn.net/v/oceans.mp4',
            type: 'video/mp4'
          }
        ]
      }
    }
  },
  components: {
    VideoPlayer
  },
  mounted () {
    let ipAddressCookie = Cookies.get('ipAddress')
    let reg = new RegExp(
      /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
    )
    if (reg.test(ipAddressCookie)) {
      this.ipAddress = ipAddressCookie
    }
    this.$nextTick(() => {
      this.$refs.inAddressInput.focus()
    })
  },
  methods: {
    confirm () {
      let reg = new RegExp(
        /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      )
      if (reg.test(this.ipAddress)) {
        axios
          .get(`http://${this.ipAddress}:52020/playUrl`)
          .then((res) => {
            this.playUrl = res.data
            this.videoOptions.sources[0].src = this.playUrl
            this.visible = false
            this.$nextTick(() => {
              this.checkInterface()
              Cookies.set('ipAddress', this.ipAddress)
            })
          })
          .catch((e) => {
            this.$message.error('连接失败')
          })
      } else {
        this.$message.error('请输入正确的 IP 地址')
      }
    },
    checkInterface () {
      let _this = this
      const timer = window.setInterval(() => {
        setTimeout(function () {
          // chooseProduct 自己封装的axios请求
          axios
            .get(`http://${_this.ipAddress}:52020/playUrl`)
            .then((res) => {
              if (_this.playUrl !== res.data) {
                _this.playUrl = res.data
                _this.videoOptions.sources[0].src = _this.playUrl
                _this.$nextTick(() => {
                  Cookies.set('ipAddress', _this.ipAddress)
                })
              }
            })
            .catch((e) => {
            })
        }, 0)
      }, 2000)
      // 清除定时器
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  }
}
</script>

<style scoped>
.videoPlayer >>> .vjs_video_3-dimensions {
    width: 100%;
    height: 100%;
}
.videoPlayer >>> .video-js {
    width: 100%;
    height: 100%;
}
</style>
