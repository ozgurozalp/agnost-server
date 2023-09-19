import { ModelBase } from "../ModelBase";
import { Field } from "../Field";

/**
 * Not an actual model field but simulates a joined model as a field
 *
 * @export
 * @class Field
 */
export class ArrayFilterField extends Field {
  /**
   * The name of the field
   * @protected
   * @type {string}
   */
  protected fieldName: string;

  /**
   * Creates an instance of the field object.
   * @param {any} meta Provides access to the application the version configuration
   * @param {ModelBase} model Reference to the {@link ModelBase} of the field
   */
  constructor(meta: any, model: ModelBase, fieldName: string) {
    super(meta, model);
    this.fieldName = fieldName;
  }

  /**
   * Returns field type
   * @returns Type of the field
   */
  getType() {
    return "array-filter";
  }

  /**
   * Returns field query path
   * @returns Query path of the field
   */
  getQueryPath() {
    return this.fieldName;
  }

  /**
   * Returns field name
   * @returns Name of the field
   */
  getName() {
    return this.fieldName;
  }
}
