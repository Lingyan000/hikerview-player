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
import axios from 'axios'
import VideoPlayer from '@/components/VideoPlayer/index'
import { remote, ipcRenderer } from 'electron'
import { URL } from 'url'

// Modify the user agent for all requests to the following urls.
const filter = {
  urls: ['https://*.github.com/*', '*://electron.github.io']
}

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
    setHeaders () {
      let headersStr = this.playUrl.split(';')[1] || ''
      if (headersStr !== '') {
        try {
          let regBrace = /\{(.+?)\}/
          headersStr = headersStr.match(regBrace)[1]
          let headersArr = headersStr.split('&&')
          let url = new URL(this.playUrl.split(';')[0])
          let host = url.host
          let filter = {
            urls: [`*://${host}/*`]
          }
          ipcRenderer.send('uploadRequestHeaders', filter, headersArr)
        } catch (e) {
          this.$message.error('糟糕...发生了一些错误，可能是 headers 有误')
          console.error(e)
        }
      }
    },
    confirm () {
      let reg = new RegExp(
        /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      )
      if (reg.test(this.ipAddress)) {
        axios
          .get(`http://${this.ipAddress}:52020/playUrl`)
          .then((res) => {
            this.playUrl = res.data
            this.setHeaders()
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
            .get(`http://${_this.ipAddress}:52020/playUrl`)
            .then((res) => {
              if (_this.playUrl !== res.data) {
                _this.playUrl = res.data
                _this.setHeaders()
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
