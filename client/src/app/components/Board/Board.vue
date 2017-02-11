<template>
  <div class="wrapper">
    <div class="board" @dragover.prevent @drop="onDrop">
      <div class="head">
        <div class="square" v-for="key in ['CM', 'TD', 'TP']">{{ key }}</div>
        <div class="label">
          <div class="id">Unité d'enseignement</div>
        </div>
        <div class="square">Total</div>
      </div>
      <div class="main" ref="board" @scroll="closeSelector()">
        <div class="degree" v-for="degree in degrees">
          <label class="degree">{{ degree.name }}</label>
          <div v-for="(semester, index) in degree.semesters">
            <label class="semester">Semestre {{ index }}</label>
            <item v-for="tu in semester.teachingUnits" :data="tu" :key="tu._id" />
          </div>
        </div>
      </div>
      <div class="foot">
        <div class="square" v-for="key in ['CM', 'TD', 'TP']" :title="key">{{ sum(key) }}h</div>
        <div class="label"></div>
        <div class="square" title="Total">{{ sum() }}h</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Store from '../../store/GlobalStore';
  import Item from './BoardItem.vue';

  export default {
    name: 'Categories',
    components: {
      Item
    },

    data() {
      return {
        teachingUnits: Store.teachingUnits.user
      }
    },

    methods: {
      closeSelector() {
        Store.eventHub.$emit('closeSelector');
      },
      /**
       * Element drop event
       */
      onDrop(e: DragEvent) {
        Store.addItem(e.dataTransfer.getData('id'));
      },

      sum(key?: string) {
        if (key) {
          return this.teachingUnits.reduce((sum, tu) => {
            return sum + tu.userVolume[key];
          }, 0);
        }

        return this.teachingUnits.reduce((sum, tu) => {
          return sum + tu.userVolume.CM + tu.userVolume.TD + tu.userVolume.TP;
        }, 0);
      }
    },

    computed: {
      degrees() {
        return Store.toDegrees(this.teachingUnits)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/common.scss";

  .wrapper {
    padding-top: 2em;
    padding-bottom: 1em;
  }

  .board {
    @extend .z-1-light;
    background-color: $white-color;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 1em 2em;
    margin: 0 auto;
    width: 95%;
    // max-width: 900px;
    min-height: 100%;
    max-height: 100%;
    border-radius: 3px;
  }

  .head, .foot {
    display: flex;
    font-weight: 600;
    padding: 1em 0;

    & > div {
      box-shadow: 1px 0 transparentize($text-color, .75);
    }

    .square {
      width: 61px;
      text-align: center;

      &:last-child {
        margin-right: 32px;
      }
    }

    .label {
      flex-grow: 1;
      margin-left: 11px;
    }
  }

  .head {
    overflow-y: scroll;
    box-shadow: 0 1px transparentize($text-color, .75);
  }
  .foot {
    overflow-y: scroll;
    font-size: .9em;
    box-shadow: 0 -1px transparentize($text-color, .75);
  }

  .main {
    padding-top: 1.5em;
    padding-bottom: 2em;
    overflow-y: scroll;
    flex: 1;
  }


  .degree {
    position: relative;

    label {
      display: inline-block;
      text-transform: uppercase;
      font-size: 0.85em;
      font-weight: 600;

      &.degree {
        font-size: 1em;
        color: transparentize($text-color, 0.2);
      }
      &.semester {
        margin-top: .8em;
        margin-bottom: .4em;
        color: transparentize($text-color, 0.5);
      }
    }
  }

</style>
