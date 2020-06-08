export class Serializable {
  constructor() { }

  /**
   * Serializa objetos de uma classe.
   * @param object objecto a ser serializado.
   */
  fromObject(object): this {
    for (const propName in object) {
      if (object.hasOwnProperty(propName)) {
        this[propName] = object[propName];
      }
    }
    return this;
  }
}
