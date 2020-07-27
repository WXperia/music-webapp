<template lang="">
  <div class="singer" ref="singer">
    <listview :data="singers"></listview>
  </div>
</template>
<script>
import { getSingerList } from '@/api/singer.js'
import { ERR_OK } from '@/api/config.js'
import Singer from '@/common/js/singer.js'
import listview from '@/base/listview/listview'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    async _getSingerList () {
      let res = await getSingerList()
      if (res.code === ERR_OK) {
        console.log(res.data)
        this.singers = this._normalizeSinger(res.data.list)
        console.log(this.singers)
      }
    },
    //                Farea: "1"
    // Fattribute_3: "3"
    // Fattribute_4: "0"
    // Fgenre: "0"
    // Findex: "X"
    // Fother_name: "Joker"
    // Fsinger_id: "5062"
    // Fsinger_mid: "002J4UUk29y8BY"
    // Fsinger_name: "薛之谦"
    // Fsinger_tag: "541,555"
    // Fsort: "1"
    // Ftrend: "0"
    // Ftype: "0"
    // voc: "0"
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map['hot'].items.push(
            new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name })
          )
        } else {
          if (!map[item.Findex]) {
            map[item.Findex] = {
              title: item.Findex,
              items: []
            }
          }
            map[item.Findex].items.push(
              new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name })
            )
        }
      })
      // 转化为有序列表 处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let item = map[key]
        if (item.title.match(/[a-zA-Z]/)) {
          ret.push(item)
        } else if (item.title === HOT_NAME) {
          hot.push(item)
        }
      }
      ret
        .sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
      return [...hot, ...ret]
    }
  },
  components: {
    listview
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
