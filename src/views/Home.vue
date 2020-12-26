<template>
  <div class="home">
    <videoJs :src="playUrl" />
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
          v-model="ipAddress"
          placeholder="请输入 IP 地址"
          size="small"
          clearable
          autofocus
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
import videoJs from "@/components/videoJs";
import Cookies from "js-cookie";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      visible: true,
      ipAddress: "",
      playUrl: "",
    };
  },
  components: {
    videoJs,
  },
  methods: {
    confirm() {
      let reg = new RegExp(
        /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      );
      if (reg.test(this.ipAddress)) {
        axios
          .get(`http://${this.ipAddress}:52020/playUrl`)
          .then((res) => {
            this.playUrl = res.data;
            this.visible = false;
            this.$nextTick(() => {
              Cookies.set("ipAddress", this.ipAddress);
            });
          })
          .catch((e) => {
            this.$message.error("连接失败");
          });
      } else {
        this.$message.error("请输入正确的 IP 地址");
      }
    },
  },
};
</script>
