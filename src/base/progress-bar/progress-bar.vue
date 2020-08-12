<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" ></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchend="progressTouchEnd"
        @touchmove.prevent="progressTouchMove"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'
const progressBtnWidth = 10
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
      this.touch = {}
  },
  methods: {
      progressTouchStart (e) {
          this.touch.initiated = true
          this.touch.startX = e.touches[0].pageX
          /* 获取当前歌曲播放进度的长度 */
          this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchEnd (e) {
           this.touch.initiated = false
           this._triggerPercent()
      },
      progressTouchMove (e) {
          if (!this.touch.initiated) {
              return false
        }
          this.touch.moveX = e.touches[0].pageX
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          let delta = this.touch.moveX - this.touch.startX
          let moveLength = Math.min(barWidth, Math.max(0, delta + this.touch.left))
          this._moveProgress(moveLength)
      },
      progressClick (e) {
          this._moveProgress(e.offsetX)
          this._triggerPercent()
      },
      _moveProgress (len) {
           this.$refs.progress.style.width = `${len}px`
           this.$refs.progressBtn.style[transform] = `translate3d(${len}px,0,0)`
      },
      _triggerPercent () {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const percnet = this.$refs.progress.clientWidth / barWidth

          this.$emit('percentChange', percnet)
      }
  },
  watch: {
    percent (newPercent) {
      if (newPercent > 0 && this.touch.initiated) return
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = newPercent * barWidth
      this._moveProgress(offsetWidth)
    }
  }
}
</script>
<style lang="stylus" scoped>
   @import "~common/stylus/variable"

.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
