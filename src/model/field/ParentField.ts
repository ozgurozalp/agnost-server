import { ModelBase } from "../ModelBase";
import { Field } from "../Field";

/**
 * The Parent field
 *
 * @export
 * @class Field
 */
export class ParentField extends Field {
	/**
	 * Creates an instance of the field object.
	 * @param {any} meta Provides access to the application the version configuration
	 * @param {Model} model Reference to the {@link Model} of the field
	 */
	constructor(meta: any, model: ModelBase) {
		super(meta, model);
	}
}
