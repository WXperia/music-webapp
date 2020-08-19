<template>
  <transition appear name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { mapGetters } from 'vuex'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    created () {
      console.log('disc')
      this._getSongList()
    },
    methods: {
      async _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return false
        }
       try {
         let res = await getSongList(this.disc.dissid)
         if (res.code === ERR_OK) {
          let songs = await processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist))
          this.songs = songs
         }
       } catch (e) {
         console.log(e)
       }
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      ...mapGetters(['disc']),
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
