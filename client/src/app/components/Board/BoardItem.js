// @flow

import Selector from './Selector.vue';
import type {Volume} from '../../../../../types/teachingUnits.js';
import Store from '../../store/GlobalStore';

export default {
  name: 'board-item',
  props: ['data'],

  components: {
    Selector
  },

  data() {
    return {
      needsUpdate: false,
      selector: {
        visible: false,
        currentKey: '',
        color: '',
        volume: {
          user: 0,
          global: 0
        },
        position: {
          top: 0,
          left: 0
        }
      }
    };
  },

  created() {
    Store.eventHub.$on('closeSelector', this.onCloseSelector);
    window.addEventListener('mousedown', this.closeSelector);
  },

  destroyed() {
    Store.eventHub.$off('closeSelector', this.onCloseSelector);
    window.removeEventListener('mousedown', this.closeSelector);
  },

  methods: {
    comma(value: number): string {
      return value.toFixed(1);
    },

    state(key: string): string {
      if (this.selector.currentKey !== '') {
        return this.selector.currentKey === key ? 'focus' : 'unfocus';
      }
      return '';
    },

    onSelect(value: number) {
      this.data.userVolume[this.selector.currentKey] = value;
      this.needsUpdate = true;
    },

    closeSelector() {
      Store.eventHub.$emit('closeSelector');
    },

    onCloseSelector() {
      this.selector.visible = false;
      this.selector.position.top = 0;
      this.selector.position.left = 0;
      this.selector.currentKey = '';
      if (this.needsUpdate) {
        Store.updateItem(this.data._id);
        this.needsUpdate = false;
      }
    },

    toggleSelector({currentTarget}: {currentTarget: HTMLElement}, key: string) {
      const top = currentTarget.offsetTop + currentTarget.offsetHeight;
      const left = currentTarget.offsetLeft + currentTarget.offsetWidth / 4;

      if (top === this.selector.position.top && left === this.selector.position.left) {
        this.onCloseSelector();
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
      if (e.dataTransfer) {
        e.dataTransfer.setData('id', this.data._id);
      }
    }
  },

  computed: {
    tooltip(): string {
      const users: Array<{firstName: string, lastName: string, volume: Volume}> = this.data.users;

      return users.map(user => {
        return `
          <div>
            <div class="user" style="margin-bottom:.2em;font-size:1.1em;text-decoration:underline">${user.firstName} ${user.lastName}</div>
            <div class="volume" style="margin-left:.4em">CM: ${user.volume.CM}h, TD: ${user.volume.TD}h, TP: ${user.volume.TP}h</div>
          </div>
        `;
      }).join('');
    },

    volume(): number {
      return this.data.userVolume.CM +
        this.data.userVolume.TD +
        this.data.userVolume.TP;
    }
  }
};
