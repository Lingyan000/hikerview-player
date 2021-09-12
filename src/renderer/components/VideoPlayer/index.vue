<template>
  <div class="video-player" v-if="reseted">
    <video class="video-js vjs-default-skin vjs-big-play-centered" ref="video">
      <track v-for="(crtTrack,index) in trackList" :key="index" :kind="crtTrack.kind" :label="crtTrack.label" :src="crtTrack.src" :srcLang="crtTrack.srcLang" :default="crtTrack.default"/>
    </video>
  </div>
</template>

<script>
import Vue from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import './custom-theme.css'
import videojshotkeys from 'videojs-hotkeys'
import hls from 'videojs-contrib-hls'
import './videojs-resume'
import './videojs-resume.css'

window.videojs = videojs
require('video.js/dist/lang/zh-CN.js')
Vue.use(videojshotkeys)
Vue.use(hls)

// pollfill
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value (target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      const to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}
// as of videojs 6.6.0
const DEFAULT_EVENTS = [
  'loadeddata',
  'canplay',
  'canplaythrough',
  'play',
  'pause',
  'waiting',
  'playing',
  'ended',
  'error'
]

export default {
  name: 'video-player',
  props: {
    start: {
      type: Number,
      default: 0
    },
    crossOrigin: {
      type: String,
      default: ''
    },
    playsinline: {
      type: Boolean,
      default: false
    },
    customEventName: {
      type: String,
      default: 'statechanged'
    },
    options: {
      type: Object,
      required: true
    },
    events: {
      type: Array,
      default: () => []
    },
    globalOptions: {
      type: Object,
      default: () => ({
        // autoplay: false,
        controls: true,
        // preload: 'auto',
        // fluid: false,
        // muted: false,
        controlBar: {
          remainingTimeDisplay: false,
          playToggle: {},
          progressControl: {},
          fullscreenToggle: {},
          volumeMenuButton: {
            inline: false,
            vertical: true
          }
        },
        techOrder: ['html5'],
        plugins: {
          customPlugin: { name: 'customName' }
        }
      })
    },
    globalEvents: {
      type: Array,
      default: () => []
    },
    trackList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      player: null,
      reseted: true
    }
  },
  mounted () {
    this.customPlugin()
    if (!this.player) {
      this.initialize()
    }
    // this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
    //   this.hotkeys({
    //     volumeStep: 0.1,
    //     seekStep: 5,
    //     enableModifiersForNumbers: false
    //   })
    //   console.log('onPlayerReady', this)
    // })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    customPlugin () {
      const vjs = window.videojs
      const self = this
      const customPlugin = function () {
        const player = this

        // 方式多次加载，再销毁之前
        if (!player.el()) {
          return
        }

        const customButtom = videojs.getComponent('Button')
        const selectionsButton = videojs.extend(customButtom, {
          constructor: function (player, options) {
            customButtom.call(this, player, options)
            this.controlText('选集')
          },
          handleClick: function () {
            self.$emit('handle-selections')
          },
          buildCSSClass: function () {
            return 'vjs-selections-control vjs-control vjs-button'
          }
        })
        const nextButton = videojs.extend(customButtom, {
          constructor: function (player, options) {
            customButtom.call(this, player, options)
            this.controlText('下一集')
          },
          handleClick: function () {
            self.$emit('handle-next')
          },
          buildCSSClass: function () {
            return 'vjs-next-control vjs-control vjs-button'
          }
        })
        videojs.registerComponent('selectionsButton', selectionsButton)
        videojs.registerComponent('nextButton', nextButton)

        player.one('loadstart', function () {
          const selectionsButtomBtn = player.controlBar.addChild('selectionsButton', {})
          const nextButtonBtn = player.controlBar.addChild('nextButton', {})
          console.log(player.controlBar)
          player.controlBar.el().insertBefore(selectionsButtomBtn.el(), player.controlBar.fullscreenToggle.el())
          player.controlBar.el().insertBefore(nextButtonBtn.el(), player.controlBar.volumePanel.el())
        })
      }
      vjs.registerPlugin('customPlugin', customPlugin)
    },

    initialize (update = false) {
      // videojs options
      const videoOptions = Object.assign({}, this.globalOptions, this.options)
      // ios fullscreen
      if (this.playsinline) {
        this.$refs.video.setAttribute('playsinline', this.playsinline)
        this.$refs.video.setAttribute('webkit-playsinline', this.playsinline)
        this.$refs.video.setAttribute('x5-playsinline', this.playsinline)
        this.$refs.video.setAttribute('x5-video-player-type', 'h5')
        this.$refs.video.setAttribute('x5-video-player-fullscreen', false)
      }
      // cross origin
      if (this.crossOrigin !== '') {
        this.$refs.video.crossOrigin = this.crossOrigin
        this.$refs.video.setAttribute('crossOrigin', this.crossOrigin)
      }
      // emit event
      const emitPlayerState = (event, value) => {
        if (event) {
          this.$emit(event, this.player)
        }
        if (value) {
          this.$emit(this.customEventName, { [event]: value })
        }
      }
      // avoid error "VIDEOJS: ERROR: Unable to find plugin: __ob__"
      if (videoOptions.plugins) {
        delete videoOptions.plugins.__ob__
      }
      // videoOptions
      // console.log('videoOptions', videoOptions)

      // player
      if (!update) {
        const self = this
        this.player = videojs(this.$refs.video, videoOptions, function () {
          this.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
          })
          // events
          const events = DEFAULT_EVENTS.concat(self.events).concat(self.globalEvents)
          // watch events
          const onEdEvents = {}
          for (let i = 0; i < events.length; i++) {
            if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
              (event => {
                onEdEvents[event] = null
                this.on(event, () => {
                  emitPlayerState(event, true)
                })
              })(events[i])
            }
          }
          // watch timeupdate
          this.on('timeupdate', function () {
            emitPlayerState('timeupdate', this.currentTime())
          })
          // player readied
          self.$emit('ready', this)
        })
      } else {
        this.player.src(videoOptions.sources)
      }
    },
    dispose (callback) {
      if (this.player && this.player.dispose) {
        if (this.player.techName_ !== 'Flash') {
          this.player.pause && this.player.pause()
        }
        this.player.dispose()
        this.player = null
        this.$nextTick(() => {
          this.reseted = false
          this.$nextTick(() => {
            this.reseted = true
            this.$nextTick(() => {
              callback && callback()
            })
          })
        })
        /*
          if (!this.$el.children.length) {
            const video = document.createElement('video')
            video.className = 'video-js'
            this.$el.appendChild(video)
          }
          */
      }
    }
  },
  watch: {
    options: {
      deep: true,
      handler (options, oldOptions) {
        if (options && options.sources && options.sources.length) {
          if (oldOptions != null && oldOptions.sources != null && oldOptions.sources.length) {
            this.initialize(true)
          } else {
            this.dispose(() => {
              this.initialize()
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.vjs-selections-control.vjs-control.vjs-button {
  cursor: pointer;
  flex: none;
}
.video-js .vjs-selections-control .vjs-icon-placeholder {
  font-family: iconfont!important;
  font-weight: normal;
  font-style: normal;
}

.video-js .vjs-selections-control .vjs-icon-placeholder:before {
  content: "\e607";
}

.vjs-next-control.vjs-control.vjs-button {
  cursor: pointer;
  flex: none;
}
.video-js .vjs-next-control .vjs-icon-placeholder {
  font-family: VideoJS!important;
  font-weight: normal;
  font-style: normal;
}

.video-js .vjs-next-control .vjs-icon-placeholder:before {
  content: "\f11f";
}
</style>
