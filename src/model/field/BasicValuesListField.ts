import { Model } from "../Model";
import { Field } from "../Field";

/**
 * The BasicValuesList field
 *
 * @export
 * @class Field
 */
export class BasicValuesListField extends Field {
	/**
	 * Creates an instance of the field object.
	 * @param {any} meta Provides access to the application the version configuration
	 * @param {Model} model Reference to the {@link Model} of the field
	 */
	constructor(meta: any, model: Model) {
		super(meta, model);
	}

	/**
	 * Assigns the value of the field. This method is overriden by the fhe specific field classes
	 * @param {object} value Value of the field
	 * @param {object} processedData The target processed object data where the prepared field value will be set
	 * @param {object} response Provides infor about the preparation of the field
	 * @param {boolean} isCreate Whether this is a create or update operation
	 * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
	 * @throws Throws an exception if the field value cannot pass validation rules
	 */
	async setValue(
		value: any,
		processedData: any,
		response: any,
		isCreate: boolean = true,
		index: number = -1
	): Promise<any> {
		if (!isCreate && this.isReadOnly()) return;

		// Unsetting the value of the field
		if (!isCreate && value === null && this.isRequired() === false) {
			processedData[this.getName()] = [];
			return;
		}

		if (Array.isArray(value) === false) {
			return this.addValidationError(
				response,
				value,
				"not_array_of_basic_values",
				index
			);
		}

		if (value.length === 0 && this.isRequired()) {
			return this.addValidationError(
				response,
				value,
				"invalid_required_field_value",
				index
			);
		}

		for (const entry of value) {
			if (
				(typeof entry === "object" && Array.isArray(entry) === false) ||
				Array.isArray(entry)
			) {
				return this.addValidationError(
					response,
					entry,
					"unsopported_bvl_value",
					index
				);
			}
		}

		processedData[this.getName()] = value;
	}
}
