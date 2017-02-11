// @flow

import {teachingUnits} from './teachingUnits.json';
import Colors from '../Colors.js';
import Vue from 'vue';

const data = {
  teachingUnits: {
    user: [],
    available: teachingUnits
  },

  /**
   * The global event emiter and receiver
   * @type {Vue}
   */
  eventHub: new Vue(),

  /**
   * Add a teaching unit on the user selection
   * @param {string} id The teaching unit id
   * @return {Object}
   */
  addItem(id: string): void {
    const tu = this.teachingUnits.available.find(item => item._id === id);
    tu.userVolume.CM = tu.volume.CM;
    tu.userVolume.TD = tu.volume.TD;
    tu.userVolume.TP = tu.volume.TP;
    this.teachingUnits.user.push(tu);
  },

  updateItem(id: string): void {
    const tu = this.teachingUnits.user.findIndex(item => item._id === id);
    let remove = true;
    ['CM', 'TD', 'TP'].forEach(key => {
      remove = remove && this.teachingUnits.user[tu].userVolume[key] === 0;
    });

    if (remove) {
      this.teachingUnits.user.splice(tu, 1);
    }
  },

  /**
   * Transform the teaching unit list to an associative degree list
   * @param {Array<Object>} teachingUnits The teaching unit list
   * @return {Object} The degree list
   */
  toDegrees(teachingUnits: Array<Object>): Object {
    const degrees = {};

    teachingUnits
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
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
};

// Add color on teaching units
const degrees = data.toDegrees(teachingUnits);
for (const degree in degrees) {
  if (degrees.hasOwnProperty(degree)) {
    for (const semester in degrees[degree].semesters) {
      if (degrees[degree].semesters.hasOwnProperty(semester)) {
        degrees[degree].semesters[semester].teachingUnits.forEach(tu => {
          tu.color = Colors.next();
          tu.userVolume = {
            CM: 0,
            TD: 0,
            TP: 0
          };
        });
      }
    }
  }
}

export default data;
