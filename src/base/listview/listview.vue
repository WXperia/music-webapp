<template lang="">
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :probeType="3"
    :listenScroll="listenScroll"
    @scroll="_onListViewScroll"
  >
    <ul>
      <li
        v-for="(group, index) in data"
        :key="index"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">
          {{ group.title }}
        </h2>
        <ul>
          <li
            v-for="(item, index) in group.items"
            :key="index"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          :class="{current:currentIndex === index}"
          :data-index="index"
          v-for="(item, index) in shortcutList"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>
<script>
import scroll from '@/base/scroll/scroll'
import { getData } from '@/common/js/dom.js'
const ACHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  created () {
    this.touch = {}
    this.heightList = []
    this.probeType = 3
    this.listenScroll = true
  },
  computed: {
    shortcutList () {
      return this.data.map(item => {
        // console.log(item.title)
        return item.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      if (this.data[this.currentIndex]) {
        return this.data[this.currentIndex].title
      } else {
        return ''
      }
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ACHOR_HEIGHT | 0
      // console.log(delta)
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _onListViewScroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      console.log(index)
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.heightList.length - 2) {
        index = this.heightList.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      this.scrollY = this.$refs.listview.scroll.y
    },
    _caculateHeight () {
      let list = this.$refs.listGroup
      this.heightList = []
      let height = 0
      this.heightList.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.heightList.push(height)
        // console.log(this.heightList)
      }
    },
    refresh () {
      this.$refs.listview.refresh()
    }
  },
  components: {
    scroll
  },
  watch: {
    data () {
      setTimeout(() => {
        this._caculateHeight()
      }, 20)
    },
    scrollY (newY) {
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      let list = this.heightList
      console.log(list)
      for (let i = 0; i < list.length - 1; i++) {
        let height1 = list[i]
        let height2 = list[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      this.currentIndex = list.length - 2
    },
    diff (newDiff) {
      let fixtop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
      // 用于节流，防止fixtop == 0的时候进行动画跳转！！！
      if (this.fixtop === fixtop) return
      this.fixtop = fixtop
      this.$refs.fixed.style.transform = `translate3d(0,${fixtop}px,0)`
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: fixed
    z-index: 10
    right: 0
    top: 55%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
