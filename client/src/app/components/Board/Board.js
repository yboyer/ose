// @flow

import Store from '../../store/GlobalStore';
import type {Degrees, TeachingUnit} from '../../../../../types/teachingUnits.js';
import Item from './BoardItem.vue';

export default {
  name: 'Categories',
  components: {
    Item
  },

  data() {
    return {
      teachingUnits: Store.teachingUnits.user
    };
  },

  methods: {
    comma(value: number): string {
      return value.toFixed(1);
    },

    closeSelector(): void {
      Store.eventHub.$emit('closeSelector');
    },
    /**
     * Element drop event
     */
    onDrop(e: DragEvent): void {
      if (e.dataTransfer) {
        Store.addItem(e.dataTransfer.getData('id'));
      }
    },

    sum(key?: string): number {
      if (key) {
        const categ = key;
        return this.teachingUnits.reduce((sum: number, tu: TeachingUnit) => {
          return sum + tu.userVolume[categ];
        }, 0);
      }

      return this.teachingUnits.reduce((sum: number, tu: TeachingUnit) => {
        return sum + tu.userVolume.CM + tu.userVolume.TD + tu.userVolume.TP;
      }, 0);
    }
  },

  computed: {
    degrees(): Degrees {
      return Store.toDegrees(this.teachingUnits);
    }
  }
};
