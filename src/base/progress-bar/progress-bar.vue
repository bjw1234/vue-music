<template>
  <div class="progress-bar" ref="bar" @click="barClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="btn"
             @touchstart="touchStart"
             @touchmove="touchMove"
             @touchend="touchEnd">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom';

  const TRANSFORM = prefixStyle('transform');

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {};
    },
    methods: {
      touchStart (e) {
        this.touch.initaled = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.barWidth = this.$refs.bar.clientWidth;
        this.touch.offset = this.$refs.progress.clientWidth;
      },
      touchMove (e) {
        if (!this.touch.initaled) {
          return;
        }
        let detail = e.touches[0].pageX - this.touch.startX;
        let barW = this.touch.barWidth - this.$refs.btn.clientWidth;
        let offset = Math.min(Math.max(0, this.touch.offset + detail), barW);
        this._setOffset(offset);
      },
      touchEnd () {
        this.touch.initaled = false;
        this._triggerPercent();
      },
      _setOffset (offset) {
        let progress = this.$refs.progress;
        let btn = this.$refs.btn;
        progress.style.width = offset + 'px';
        btn.style[TRANSFORM] = `translate3d(${offset}px,0,0)`;
      },
      _triggerPercent () {
        let barW = this.$refs.bar.clientWidth - this.$refs.btn.clientWidth;
        let progressW = this.$refs.progress.clientWidth;
        let percent = progressW / barW;
        this.$emit('percentChange', percent);
      },
      barClick (e) {
        let rect = this.$refs.bar.getBoundingClientRect();
        let barW = this.$refs.bar.clientWidth - this.$refs.btn.clientWidth;
        let offset = Math.min(Math.max(0, e.pageX - rect.left), barW);
        let percent = offset / barW;
        this._setOffset(offset);
        this._triggerPercent(percent);
      }
    },
    watch: {
      percent (newPercent) {
        if (this.touch.initaled) {
          return;
        }
        let barW = this.$refs.bar.clientWidth - this.$refs.btn.clientWidth;
        let offset = Math.min(Math.max(0, newPercent * barW), barW);
        this._setOffset(offset);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .progress-bar
    width: 100%
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
          extend-click()
</style>
