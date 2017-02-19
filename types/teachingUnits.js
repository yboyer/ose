// @flow

export type Volume = {CM: number, TD: number, TP: number};

export type TeachingUnit = {
  _id: string,
  parent: string,
  degree: string,
  color: string,
  semester: number,
  label: string,
  volume: Volume,
  userVolume: Volume
};

export type Degree = {
  name: string,
  semesters: {
    [n: string]: {
      teachingUnits: Array<TeachingUnit>
    }
  }
};

export type Degrees = {
  [id: string]: Degree
};
