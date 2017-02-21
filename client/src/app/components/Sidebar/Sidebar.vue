<template>
  <aside class="sidebar">
    <div class="wrapper">
      <div class="search">
        <input type="text" v-model="itemFilter" placeholder="Filter la selection..." />
        <div class="clear" v-show="itemFilter !== ''" @click="itemFilter = ''">&#x2715;</div>
      </div>
      <div class="degrees" v-for="degree in degrees">
        <label class="degree">{{ degree.name }}</label>
        <div v-for="(semester, index) in degree.semesters">
          <label class="semester">Semestre {{ index }}</label>
          <item v-for="tu in filterItems(semester.teachingUnits)" :data="tu" :key="tu._id" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
  import Item from './SbItem.vue';
  import Store from '../../store/GlobalStore';
  import type {Degrees, TeachingUnit} from '../../../../../types/teachingUnits.js';

  export default {
    name: 'Sidebar',
    components: {
      Item
    },

    data() {
      return {
        itemFilter: '',
        teachingUnits: Store.teachingUnits.available
      };
    },

    methods: {
      filterItems(items: Array<TeachingUnit>): Array<TeachingUnit> {
        return items.filter(item => {
          const filter = this.itemFilter.toLowerCase();
          const fields = [item.label]; // The fields to filter

          return fields.some(field => {
            return field.toLowerCase().includes(filter)
          })
        });
      }
    },

    computed: {
      degrees(): Degrees {
        return Store.toDegrees(this.teachingUnits)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/common.scss";

  .sidebar {
    @extend .z-3-light;
    width: 425px;
    position: relative;
    background-color: $white-color;
    max-height: 100vh;
    overflow-y: scroll;
  }

  .search {
    $color: $oc-indigo-3;
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    input {
      width: 100%;
      border: 1px solid #DDD;
      border-radius: 3px;
      line-height: 2.5em;
      padding: 0px 1em;
      font-family: inherit;
      color: inherit;
      outline: none;

      &:focus {
        border-color: $color;
        box-shadow: 0 0 15px transparentize($color, .9);
      }
    }

    .clear {
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      right: 0.4em;
      padding: 0.3em;
      cursor: pointer;

      &:hover {
        color: $color;
      }

      &:active {
        color: darken($color, 15%);
      }
    }
  }

  .degrees {
    margin-top: 1.5em;
    margin-bottom: 2em;

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
        margin-top: .5em;
        color: transparentize($text-color, 0.5);
      }
    }
  }

</style>
