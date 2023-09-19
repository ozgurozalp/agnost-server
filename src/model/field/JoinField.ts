import { ModelBase } from "../ModelBase";
import { Field } from "../Field";

/**
 * Not an actual model field but simulates a joined model as a field
 *
 * @export
 * @class Field
 */
export class JoinField extends Field {
  /**
   * Creates an instance of the field object.
   * @param {any} meta Provides access to the application the version configuration
   * @param {ModelBase} model Reference to the {@link ModelBase} of the field
   */
  constructor(meta: any, model: ModelBase) {
    super(meta, model);
  }

  /**
   * Returns field type
   * @returns Type of the field
   */
  getType() {
    return "join";
  }

  /**
   * Returns field query path
   * @returns Query path of the field
   */
  getQueryPath() {
    return this.getName();
  }
}
