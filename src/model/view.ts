import { IViewModel } from '../utils/Interfaces/Model.interface';

export default class View {
  _id: string;
  name: string;
  settings: any;

  constructor(object: IViewModel) {
    this._id = object._id;
    this.name = object.name;
    this.settings = object.settings;
  }
}
