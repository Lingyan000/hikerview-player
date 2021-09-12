<template>
  <el-drawer
      title="选集"
      :visible="value"
      direction="rtl"
      custom-class="set-list-drawer"
      width="80%"
      @close="cancel"
      @open="open"
  >
    <div class="set-list-body" v-loading="loading">
      <div class="set-list-content">
        <div class="set-list-box">
          <div class="set-list-li" v-for="(title, i) in list" :key="i">
            <el-button @click="play(title, i)" style="width: 100%">{{ title }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SetList',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    baseUrl: {
      type: String,
      default: 'http://0.0.0.0:52020'
    }
  },

  data () {
    return {
      loading: false,
      list: []
    }
  },

  methods: {
    open () {
      this.$nextTick(() => {
        this.loading = true
        axios.get(`${this.baseUrl}/getPlayList`).then(res => {
          this.list = res.data
        }).finally(() => {
          this.loading = false
        })
      })
    },

    play (title, index) {
      this.loading = true
      axios.get(`${this.baseUrl}/playMe`, {
        params: {
          index,
          title
        }
      }).then((res) => {
        if (res.data) {
          this.$emit('handle-play')
        } else {
          this.$message.warning('请确保手机停留在播放页面')
        }
      }).finally(() => {
        this.loading = false
      })
    },

    closeDrawer () {
      this.$emit('input', false)
    },

    cancel () {
      this.closeDrawer()
    }
  }
}
</script>

<style lang="scss">
.set-list-drawer {
  width: 80% !important;

  .el-drawer__body {
    overflow: auto;
  }
}

.set-list-body {
  width: 100%;
  height: 100%;
}

.set-list-content {
  width: 100%;
  height: 100%;
}

.set-list-box {
  padding: 5px 8px;
  display: grid;
  grid-column-gap: 8px;
  grid-row-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
