<template>
  <div>
    <!--  添加订单时  -->
    <el-drawer
      :visible.sync="visible_"
      direction="rtl"
      size="50%"
    >
      <div class="pad">
        <order
          :max-height="maxHeight"
          :i-select="true"
          :seq="2"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import order from '../order/index';
export default {
    components: {
        order
    },
    data() {
      return {
        maxHeight: 500
      };
    },
    computed: {
      ...mapGetters('composing', {
        'visible': 'visible'
      }),
      visible_: {
        get: function () {
            return this.visible;
        },
        set: function (val) {
            this.visibleAction(val);
        }
      }
    },
    methods: {
      ...mapActions('composing', ['visibleAction'])
    }
};
</script>

<style lang="scss" scoped>
.pad {
  padding: 0 20px;
}
.el-drawer__header {
  margin-bottom: 0;
}
</style>
