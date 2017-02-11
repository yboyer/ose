// @flow

import Selector from './Selector.vue';
import Store from '../../store/GlobalStore';

export default {
  name: 'sb-item',
  props: ['data', 'color'],

  components: {
    Selector
  },

  data() {
    return {
      selector: {
        visible: false,
        currentKey: '',
        color: '',
        volume: {
          user: 0,
          global: 30
        },
        position: {
          top: 0,
          left: 0
        }
      }
    };
  },

  created() {
    Store.eventHub.$on('closeSelector', () => {
      this.closeSelector();
    });

    window.addEventListener('mousedown', () => {
      Store.eventHub.$emit('closeSelector');
    });
  },

  methods: {
    onSelect(value: number) {
      this.data.userVolume[this.selector.currentKey] = value;
      Store.updateItem(this.data._id);
      this.closeSelector();
    },

    closeSelector() {
      this.selector.visible = false;
      this.selector.position.top = 0;
      this.selector.position.left = 0;
    },

    toggleSelector({currentTarget}: MouseEvent, key: string) {
      const top = currentTarget.offsetTop + currentTarget.offsetHeight;
      const left = currentTarget.offsetLeft + currentTarget.offsetWidth / 2;

      if (top === this.selector.position.top && left === this.selector.position.left) {
        this.closeSelector();
      } else {
        Store.eventHub.$emit('closeSelector');
        this.selector.visible = true;
        this.selector.position = {
          top,
          left
        };
        this.selector.currentKey = key;
        this.selector.volume = {
          user: this.data.userVolume[key],
          global: this.data.volume[key]
        };
      }
    },

    remove() {
      this.data.userVolume.CM = 0;
      this.data.userVolume.TD = 0;
      this.data.userVolume.TP = 0;
      Store.updateItem(this.data._id);
    },

    dragnewcompont(e: DragEvent) {
      e.dataTransfer.setData('id', this.data._id);
    }
  },

  computed: {
    volume(): number {
      return this.data.userVolume.CM +
        this.data.userVolume.TD +
        this.data.userVolume.TP;
    }
  }
};
