// @flow

import Colors from '../Colors.js';
import type {Volume, TeachingUnit, Degrees} from '../../../../types/teachingUnits.js';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

const url = 'http://localhost:3300/teachingunits';

class GlobalStore {
  teachingUnits: {user: Array<TeachingUnit>, available: Array<TeachingUnit>} = {
    user: [],
    available: []
  };

  /** @type {Vue} The global event emiter and receiver */
  eventHub = new Vue();

  constructor() {
    Vue.http.get(url).then(res => {
      this.applyRainbowColors(res.data);
      this.teachingUnits.available.push(... res.data);

      // Add user selected teaching units
      this.teachingUnits.available
        .filter(tu => this.sumVolume(tu.userVolume) !== 0)
        .forEach(tu => this.teachingUnits.user.push(tu));
    });
  }

  /**
   * Sumarize the teaching unit's volume
   * @param {Volume} volume The volume
   * @return {number} The sum
   */
  sumVolume(volume: Volume): number {
    return volume.CM +
      volume.TD +
      volume.TP;
  }

  /**
   * Add a teaching unit on the user selection
   * @param {string} id The teaching unit id
   */
  addItem(id: string): void {
    const tu = this.teachingUnits.available.find(item => item._id === id);
    if (tu) {
      tu.userVolume.CM = tu.volume.CM;
      tu.userVolume.TD = tu.volume.TD;
      tu.userVolume.TP = tu.volume.TP;
      this.teachingUnits.user.push(tu);
      this.saveInDB(tu);
    }
  }

  /**
   * Update the available and user list for a given teaching unit
   * @type {string} id The teaching unit id
   */
  updateItem(id: string): void {
    const tuIndex = this.teachingUnits.user.findIndex(item => item._id === id);
    if (~tuIndex) {
      this.saveInDB(this.teachingUnits.user[tuIndex]);

      const needsRemove = ['CM', 'TD', 'TP'].reduce((needsRemove, key) => {
        return needsRemove && this.teachingUnits.user[tuIndex].userVolume[key] === 0;
      }, true);

      if (needsRemove) {
        this.teachingUnits.user.splice(tuIndex, 1);
      }
    }
  }

  /**
   * Save the edited teaching unit on database
   * @param {TeachingUnit} tu The teaching unit to save
   */
  saveInDB(tu: TeachingUnit): Promise<*> {
    const data = {
      volume: tu.userVolume
    };
    return Vue.http.post(`${url}/${tu._id}`, data);
  }

  /**
   * Add color on teaching units
   * @param {Array<TeachingUnit>} teachingUnits
   */
  applyRainbowColors(teachingUnits: Array<TeachingUnit>): void {
    const degrees = this.toDegrees(teachingUnits);
    for (const degree in degrees) {
      if (degrees.hasOwnProperty(degree)) {
        for (const semester in degrees[degree].semesters) {
          if (degrees[degree].semesters.hasOwnProperty(semester)) {
            degrees[degree].semesters[semester].teachingUnits.forEach(tu => {
              tu.color = Colors.next();
            });
          }
        }
      }
    }
  }

  /**
   * Transform the teaching unit list to an associative degree list
   * @param {Array<TeachingUnit>} teachingUnits The teaching unit list
   * @return {Degrees} The degree list
   */
  toDegrees(teachingUnits: Array<TeachingUnit>): Degrees {
    const degrees = {};

    teachingUnits
      .sort((a, b) => {
        if (a.degree.toLowerCase() < b.degree.toLowerCase()) {
          return -1;
        }
        if (a.degree.toLowerCase() > b.degree.toLowerCase()) {
          return 1;
        }

        if (a.semester < b.semester) {
          return -1;
        }
        if (a.semester > b.semester) {
          return 1;
        }

        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1;
        }
        if (a.label.toLowerCase() > b.label.toLowerCase()) {
          return 1;
        }

        return 0;
      })
      .forEach(tu => {
        if (!degrees[tu.degree]) {
          degrees[tu.degree] = {
            name: tu.degree,
            semesters: {}
          };
        }
        if (!degrees[tu.degree].semesters[tu.semester]) {
          degrees[tu.degree].semesters[tu.semester] = {
            teachingUnits: []
          };
        }
        degrees[tu.degree].semesters[tu.semester].teachingUnits.push(tu);
      });

    return degrees;
  }
}

export default new GlobalStore();
