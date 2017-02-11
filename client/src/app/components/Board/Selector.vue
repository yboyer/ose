<template>
  <div class="selector" @mousedown.stop :class="[color]":style="{top: (position.top+10)+'px', left: (position.left - 80/2)+'px'}">
    <div class="container">
      <div
        class="item"
        v-for="index in volume.global+1"
        :class="{selected: index-1 === volume.user}"
        @click.stop="click(index-1)">{{ index-1 }}h</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Selector',
    props: ['volume', 'position', 'color'],
    methods: {
      click(index: number) {
        this.$emit('select', index);
      }
    },

    watch: {
      volume() {
        this.$el.childNodes[0].scrollTop = 0;
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/common.scss";

  .selector {
    $nbItem: 11.5;
    position: absolute;
    width: 80px;
    z-index: 1;

    &:before {
      $size: 10px;
      content: '';
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      left: 0;
      border-left: $size solid transparent;
      border-right: $size solid transparent;
      border-bottom: $size solid;
      top: -$size;
      left: 50%;
      transform: translateX(calc(-50%));
    }

    .container {
      border-radius: 4px;
      font-size: .9em;
      overflow: auto;
      max-height: calc(2.3em * #{$nbItem});
    }

    .item {
      height: 2.3em;
      color: $white-color;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color .1s;

      &:hover {
        transition-duration: 0s;
      }
      &:active {
        transition-duration: 0s;
      }
    }
  }

  @mixin mix-item($color) {
    $selected: lighten($color, 7.5%);

    &:before {
      border-bottom-color: $color;
    }

    .container {
      box-shadow: 0 0 0 1px rgba(#000, .1), 0 10px 25px 0 transparentize($color, .6);
      background: $color;
    }

    .item {
      &:not(:last-child) {
        border-bottom: 1px solid $selected;
      }

      &.selected {
        background-color: $selected;
      }

      &:hover {
        background-color: lighten($color, 5%);
      }
      &:active {
        background-color: darken($color, 5%);
      }
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
