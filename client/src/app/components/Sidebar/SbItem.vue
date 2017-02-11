<template>
  <div class="item" :class="[data.color || 'indigo', edited ? 'disabled' : '']" @dragstart.self="dragnewcompont" :draggable="!edited">
    <div class="square">{{ volume }}h</div>
    <div class="square hidden" title="CM">{{ diff('CM') }}h</div>
    <div class="square hidden" title="TD">{{ diff('TD') }}h</div>
    <div class="square hidden" title="TP">{{ diff('TP') }}h</div>
    <div class="label" :title="`${data.label}`">
      <div class="id">{{ data.label }}</div>
      <div class="subtitle" v-if="data.parent">{{ data.parent }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sb-item',
    props: ['data', 'color'],

    methods: {
      diff(key: string): number {
        return this.data.volume[key] - this.data.userVolume[key]
      },
      dragnewcompont(e) {
        e.dataTransfer.setData('id', this.data._id);
      }
    },

    computed: {
      edited() {
        return this.data.userVolume.CM !== 0 || this.data.userVolume.TD !== 0 || this.data.userVolume.TP !== 0;
      },
      volume() {
        return this.diff('TP') + this.diff('TD') + this.diff('CM');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/common.scss";

  .item {
    display: flex;
    align-items: center;
    margin: 20px 0;
    padding-right: .5em;
    transition-property: color, background-color, box-shadow;
    transition-duration: .2s;
    border-radius: 3px;

    &:not(.disabled) {
      cursor: move;

      &:hover {
        transition-duration: .1s;

        .square.hidden {
          width: 34px;
        }
        .square:not(.hidden) {
          width: 0;
          margin: 0;
        }
      }
    }

    &.disabled {
      opacity: .5;
    }

    .square {
      $size: 34px;

      flex-shrink: 0;
      font-size: .8em;
      width: $size;
      height: $size;
      border-radius: 3px;
      color: #FFF;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: all .2s ease;
      margin-right: 1px;

      &.hidden {
        width: 0;
      }
    }

    .label {
      margin-left: 11px;
      font-weight: 600;
      overflow: hidden;
    }

    .wrap {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-bottom: 2px;
    }

    .id {
      @extend .wrap;
    }

    .subtitle {
      @extend .wrap;
      font-size: .8em;
      font-weight: 400;
    }
  }

  @mixin mix-item($color) {
    &:not(.disabled) {
      &:hover {
        background-color: transparentize($color, .9);
      };

      &:active {
        background-color: $color;
        color: #FFF;
        cursor: grabbing;
        box-shadow: 0 10px 25px 0 transparentize($color, .6);

        .square {
          box-shadow: 1px 0 lighten($color, 10%);
        }
      };
    }

    .square {
      background-color: $color;
    }
  }

  .item.gray { @include mix-item($oc-gray-5); }
  .item.red { @include mix-item($oc-red-5); }
  .item.pink { @include mix-item($oc-pink-5); }
  .item.grape { @include mix-item($oc-grape-5); }
  .item.violet { @include mix-item($oc-violet-5); }
  .item.indigo { @include mix-item($oc-indigo-5); }
  .item.blue { @include mix-item($oc-blue-5); }
  .item.cyan { @include mix-item($oc-cyan-5); }
  .item.teal { @include mix-item($oc-teal-5); }
  .item.green { @include mix-item($oc-green-5); }
  .item.lime { @include mix-item($oc-lime-5); }
  .item.yellow { @include mix-item($oc-yellow-5); }
  .item.orange { @include mix-item($oc-orange-5); }
</style>
