<template>
  <div class="selector" @mousedown.stop :class="[color]" :style="{top: (position.top+10)+'px', left: '35px'}">
    <span :style="{left: ((position.left-10) - 18/2) + 'px'}"></span>
    <div class="container">
      <input type="range" v-model="volume.user" @input="click($event)" min="0" :max="volume.global" step=".5">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Selector',
    props: ['volume', 'position', 'color'],
    methods: {
      click({target}: Event) {
        this.$emit('select', Number(target.value));
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/common.scss";
  @import "range.scss";
  @import "svg-arrow.scss";

  .selector {
    $nbItem: 11.5;
    position: absolute;
    width: 200px;
    z-index: 2;

    span {
      position: absolute;
      left: 0;
      top: -6px;
      left: 50%;
      transform: translateX(calc(-50%));
    }

    .container {
      border-radius: 4px;
      font-size: .9em;
      height: 30px;
      padding: 0 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: auto;
      max-height: calc(2.3em * #{$nbItem});
    }
  }

  @mixin mix-item($color) {
    $selected: lighten($color, 7.5%);

    @include range($color);

    span {
      @include svg-arrow($text-color);
    }

    .container {
      box-shadow: 0 0 0 1px rgba(#000, .1), 0 10px 25px 0 transparentize($color, .6);
      background: $white-color;
    }
  }

  .selector.gray { @include mix-item($oc-gray-5); }
  .selector.red { @include mix-item($oc-red-5); }
  .selector.pink { @include mix-item($oc-pink-5); }
  .selector.grape { @include mix-item($oc-grape-5); }
  .selector.violet { @include mix-item($oc-violet-5); }
  .selector.indigo { @include mix-item($oc-indigo-5); }
  .selector.blue { @include mix-item($oc-blue-5); }
  .selector.cyan { @include mix-item($oc-cyan-5); }
  .selector.teal { @include mix-item($oc-teal-5); }
  .selector.green { @include mix-item($oc-green-5); }
  .selector.lime { @include mix-item($oc-lime-5); }
  .selector.yellow { @include mix-item($oc-yellow-5); }
  .selector.orange { @include mix-item($oc-orange-5); }
</style>
