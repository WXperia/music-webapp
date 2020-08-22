<template>
  <scroll @beforeScroll="listScroll" :beforeScroll="beforeScroll" ref="suggest" class="suggest" @scrollToEnd="searchMore" :data="result" :pullup="pullup">
    <ul class="suggest-list">
      <li
        class="suggest-item"
        @click="selectItem(item)"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length > 0" class="no-result-wrapper">
        <no-result :title="title"/>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import noResult from 'base/no-result/no-result'
const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: () => {
        return ''
      }
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      title: '抱歉，暂无搜索结果',
      beforeScroll: true
    }
  },
  methods: {
    listScroll () {
        this.$emit('listScroll')
    },
    selectItem (item) {
      console.log(item)
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
    },
    async searchMore () {
      if (!this.hasMore) {
        return false
      }
      this.page++
      try {
        let res = await search(this.query, this.page, this.showSinger, perpage)
        if (res.code === ERR_OK) {
          let songs = await this._genResult(res.data)
          this.result = this.result.concat(songs)
          setTimeout(() => {
            this._checkMore(res.data)
          }, 20)
        }
      } catch (error) {
        throw Error(error)
      }
    },
    async search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      try {
        let res = await search(this.query, this.page, this.showSinger, perpage)
        if (res.code === ERR_OK) {
          this.result = await this._genResult(res.data)
          setTimeout(() => {
            this._checkMore(res.data)
          }, 20)
        }
      } catch (e) {
        throw Error(e)
      }
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    async _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        try {
          let songs = await processSongsUrl(
            this._normalizeSongs(data.song.list)
          )
          ret = ret.concat(songs)
        } catch (error) {
          throw Error(error)
        }
      }
    //   console.log(ret)
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _checkMore (data) {
      const song = data.song
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage >= song.totalnum
      ) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        return
      }
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    noResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
