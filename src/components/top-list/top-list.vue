<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import musicList from 'components/music-list/music-list'
import { ERR_OK } from 'api/config'
import { getMusicList } from 'api/rank'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
export default {
  data () {
    return {
        songs: [],
        rank: true
    }
  },
  created () {
    this._getMusicList()
  },
  computed: {
    ...mapGetters(['topList']),
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      return this.topList.picUrl
    }
  },
  methods: {
    async _getMusicList () {
        if (!this.topList.id) {
            this.$router.push({
                path: '/rank'
            })
        }
      try {
        let res = await getMusicList(this.topList.id)
        if (res.code === ERR_OK) {
          this.songs = await processSongsUrl(this._normalizeSongs(res.songlist))
        }
      } catch (e) {
        throw Error(e)
      }
    },
    _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
            const musicData = item.data
            if (isValidMusic(musicData)) {
                ret.push(createSong(musicData))
            }
        })
        return ret
    }
  },
  components: {
    musicList
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
