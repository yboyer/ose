<template>
  <div class="item" :class="data.color || 'indigo'">
    <div v-for="key in ['CM', 'TD', 'TP']" :title="key">
      <div class="square" :class="[state(key)]" v-if="data.volume[key] !== 0" @mousedown.stop="toggleSelector($event, key)">{{ comma(data.userVolume[key]) }}/{{ data.volume[key] }}h</div>
      <div class="square" :class="[state(key)]" v-else>{{ data.volume[key] }}h</div>
    </div>
    <div class="label" :title="data.label">
      <div class="id">{{ data.label }}</div>
      <div class="subtitle" v-if="data.parent">{{ data.parent }}</div>
    </div>
    <div class="users" v-if="data.users.length !== 0">{{ data.users.length }}<div class="info" v-html="tooltip"></div></div>
    <div class="square" title="Total">{{ comma(volume) }}h</div>
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
    margin: 1px 25px;
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

    &.focus {
      position: relative;
      z-index: 1;
      box-shadow: 0 0 25px #FFF;
    }

    &.unfocus {
      opacity: .4;

      &:hover {
        opacity: .6;
      }
    }
  }

  .label {
    flex-grow: 1;
    margin: 0 11px;
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

  .users {
    position: relative;
    $size: 16px;
    background-color: $text-color;
    color: #FFF;
    height: $size;
    width: $size;
    font-size: .8em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    margin-right: 10px;

    &:hover {
      .info {
        transform: translateX(-50%);
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .info {
    position: absolute;
    width: 190px;
    background: $text-color;
    transform: translate(-50%, 5px);
    padding: .5em 1em;
    left: 50%;
    bottom: 100%;
    margin-bottom: 10px;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all .18s ease-out .18s;
    box-shadow: 0 10px 25px 0 transparentize($text-color, .6);

    .user {
      margin-bottom: 0.1em;
    }


    &:after {
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='12'%3E%3Cpath fill='#{$text-color}' d='M2.658 0h32.004c-6 0-11.627 12.002-16.002 12.002C14.285 12.002 8.594 0 2.658 0z'/%3E%3C/svg%3E") no-repeat;
      background-size: 100% auto;
      height: 6px;
      width: 18px;
      content: '';
      display: block;
      bottom: 100%;
      left: 50%;
      top: 100%;
      position: absolute;
      z-index: 10;
      transform: translate(-50%);
    }
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
