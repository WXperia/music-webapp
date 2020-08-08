<template>
  <transition name="slide">
      <music-list :bg-image="bgImage" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer.js'
import { ERR_OK } from 'api/config'
import { createSong, processSongsUrl } from 'common/js/song.js'
import musicList from '@/components/music-list/music-list.vue'
export default {
  data () {
    return {
      songs: []
    }
  },
  created () {
      setTimeout(() => {
          this._getSingerDetail()
      }, 20)
  },
  methods: {
      async _getSingerDetail () {
          if (!this.singer.id) {
              this.$router.push('/singer')
              return false
          }
          let res = await getSingerDetail(this.singer.id)
          if (res.code === ERR_OK) {
              this.songs = await processSongsUrl(this._normalizeSongs(res.data.list))
          }
      },
      _normalizeSongs (list) {
         let songs = []
         list.forEach((item) => {
           let { musicData } = item
           if (musicData.songid && musicData.albummid) {
             songs.push(createSong(musicData))
           }
         })
         return songs
      }
  },
  computed: {
      ...mapGetters(['singer']),
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      }
  },
  components: {
    musicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
