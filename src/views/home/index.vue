<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      name: {{ name }}
    </div>
    <div class="dashboard-text">
      rules: {{ rules }}
    </div>
    <div class="dashboard-text">
      user_id: {{ user_id }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'rules',
      'user_id'
    ])
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
