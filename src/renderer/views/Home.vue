<template>
  <div class="home">
    <video-player @ready="videoReady" class="videoPlayer" style="height: 100vh; width: 100vw" :options="videoOptions"/>
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
import axios from 'axios'
import VideoPlayer from '@/components/VideoPlayer/index'
import { remote, ipcRenderer } from 'electron'
import { URL } from 'url'

export default {
  name: 'home',
  data () {
    return {
      jumpStartDuration: 0,
      jumpEndDuration: 0,
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
    let ipAddress = this.$db.get('ipAddress')
    let reg = new RegExp(
      /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
    )
    if (reg.test(ipAddress)) {
      this.ipAddress = ipAddress
    }
    this.$nextTick(() => {
      this.$refs.inAddressInput.focus()
    })
  },
  methods: {
    videoReady (player) {
      player.on('loadedmetadata', () => {
        player.currentTime(this.jumpStartDuration)
      })
      player.on('timeupdate', () => {
        if (this.jumpEndDuration > player.remainingTime() && player.remainingTime() > 0) {
          player.currentTime(player.duration())
        }
      })
      player.Resume({
        uuid: this.playUrl,
        playbackOffset: 5,
        title: '恢复上次播放进度？',
        resumeButtonText: '是',
        cancelButtonText: '否'
      })
    },
    setHeaders (headers) {
      try {
        let url = new URL(this.playUrl)
        let hostname = url.hostname
        let filter = {
          urls: [`*://${hostname}:*/*`]
        }
        ipcRenderer.send('uploadRequestHeaders', filter, headers)
      } catch (e) {
        this.$message.error('糟糕...发生了一些错误，可能是 headers 有误')
        console.error(e)
      }
    },
    confirm () {
      let reg = new RegExp(
        /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      )
      if (reg.test(this.ipAddress)) {
        axios
          .get(`http://${this.ipAddress}:52020/playUrl`, {
            params: {
              enhance: true
            }
          })
          .then((res) => {
            this.playUrl = res.data.url
            this.jumpStartDuration = res.data.jumpStartDuration
            this.jumpEndDuration = res.data.jumpEndDuration
            this.setHeaders(res.data.headers || {})
            if (this.playUrl.indexOf('.m3u8') !== -1) {
              this.videoOptions.sources = [{
                src: this.playUrl.split(';')[0],
                type: 'application/x-mpegURL'
              }]
            } else {
              this.videoOptions.sources = [{
                src: this.playUrl.split(';')[0],
                type: 'video/mp4'
              }]
            }
            this.visible = false
            this.$nextTick(() => {
              this.checkInterface()
              this.$db.set('ipAddress', this.ipAddress)
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
          axios
            .get(`http://${_this.ipAddress}:52020/playUrl`, {
              params: {
                enhance: true
              }
            })
            .then((res) => {
              if (_this.playUrl !== res.data.url) {
                _this.playUrl = res.data.url
                _this.setHeaders(res.data.headers || {})
                if (_this.playUrl.indexOf('.m3u8') !== -1) {
                  _this.videoOptions.sources = [{
                    src: _this.playUrl.split(';')[0],
                    type: 'application/x-mpegURL'
                  }]
                } else {
                  _this.videoOptions.sources = [{
                    src: _this.playUrl.split(';')[0],
                    type: 'video/mp4'
                  }]
                }
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
