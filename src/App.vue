<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive><router-view></router-view></keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import mHeader from '@/components/m-header/m-header.vue'
import tab from '@/components/tab/tab.vue'
import player from '@/components/player/player.vue'
  export default {
    components: {
      mHeader, tab, player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>