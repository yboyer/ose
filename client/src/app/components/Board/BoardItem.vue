<template>
  <div class="item" :class="data.color || 'indigo'">
    <div v-for="key in ['CM', 'TD', 'TP']" :title="key">
      <div class="square" v-if="data.volume[key] !== 0" @mousedown.stop="toggleSelector($event, key)">{{ data.userVolume[key] }}/{{ data.volume[key] }}h</div>
      <div class="square" v-if="data.volume[key] === 0">{{ data.volume[key] }}h</div>
    </div>
    <div class="label" :title="data.label">
      <div class="id">{{ data.label }}</div>
      <div class="subtitle" v-if="data.parent">{{ data.parent }}</div>
    </div>
    <div class="square" title="Total">{{ volume }}h</div>
    <div class="remove" @click="remove()">&#x2717;</div>

    <selector
      v-show="selector.visible"
      :position="selector.position"
      :volume="selector.volume"
      :color="data.color"
      @select="onSelect($event)" />
  </div>
</template>

<script src="./BoardItem.js"></script>

<style lang="scss" scoped>
  @import "../../../assets/common.scss";

  select {
    background: none;
    border-style: none;
    color: inherit;
    font: inherit;
    text-align: center;
    appearance: none;
  }

  .item {
    display: flex;
    align-items: center;
    margin: 1px 0;
    transition-property: color, background-color, box-shadow;
    transition-duration: .2s;
    border-radius: 3px;

    &:hover {
      transition-duration: .1s;
    }
  }

  .square {
    outline: 0;
    flex-shrink: 0;
    font-size: .81em;
    width: 60px;
    height: 3em;
    background-color: $oc-yellow-5;
    border-radius: 3px;
    color: #FFF;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all .2s ease;
    margin-right: 1px;
  }

  .label {
    flex-grow: 1;
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

  .remove {
    padding: 0 10px;
    cursor: pointer;
  }

  @mixin mix-item($color) {
    background-color: transparentize($color, .9);

    .square {
      background-color: $color;
    }

    .remove:hover {
      color: $color;
    }
    .remove:active {
      color: darken($color, 20%);
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
