import { ModelBase } from "./ModelBase";

/**
 * The Field is the base class for all supported field types in Agnost.
 *
 * @export
 * @class Field
 */
export class Field {
	/**
	 * The metadata of the field object
	 * @protected
	 * @type {object}
	 */
	protected meta: any;

	/**
	 * The reference to the model of the field.
	 * @protected
	 * @type {ModelBase}
	 */
	protected model: ModelBase;

	/**
	 * Creates an instance of the field object.
	 * @param {any} meta Provides access to the application the version configuration
	 * @param {ModelBase} model Reference to the {@link ModelBase} of the field
	 */
	constructor(meta: any, model: ModelBase) {
		this.meta = meta;
		this.model = model;
	}

	/**
	 * Returns the model of the field
	 * @returns Name of the field
	 */
	getModel(): ModelBase {
		return this.model;
	}

	/**
	 * Returns the name of the field
	 * @returns Name of the field
	 */
	getName(): string {
		return this.meta.name;
	}

	/**
	 * Returns field type
	 * @returns Type of the field
	 */
	getType() {
		return this.meta.type;
	}

	/**
	 * Returns field query path
	 * @returns Query path of the field
	 */
	getQueryPath() {
		return this.meta.queryPath;
	}

	/**
	 * Returns the type of the database
	 * @returns Type of the database
	 */
	getDBType(): string {
		return this.model.getDb().getType();
	}

	/**
	 * Checks if the field has a default value or not
	 * @returns True if field has a default value otherwise false
	 */
	hasDefaultValue(): boolean {
		return (
			this.meta.defaultValue !== null && this.meta.defaultValue !== undefined
		);
	}

	/**
	 *  Mainly used for sub-model object fields to understand if they have any fields with a default value expression
	 * @returns True if sub-model field has fields with default values
	 */
	hasFieldsWithDefaultValue() {
		return false;
	}

	/**
	 *  Mainly used for sub-model object fields to understand if they have any required fields
	 * @returns True if sub-model field has required fields
	 */
	hasRequiredFields() {
		return false;
	}

	/**
	 * Returns the default value of the field
	 * @returns Name of the field
	 */
	getDefaultValue(): any {
		return this.meta.defaultValue;
	}

	/**
	 * Checks if the field value is read-only or not
	 * @returns True if field is read-only otherwise false
	 */
	isReadOnly(): boolean {
		return this.meta.immutable;
	}

	/**
	 * Checks if the field value is required or not
	 * @returns True if field is required otherwise false
	 */
	isRequired() {
		return this.meta.required;
	}

	/**
	 * Checks if the field is a system managed field (e.g., id, createdAt, updatedAt fields) or not
	 * @returns True if field is system managed otherwise false
	 */
	isSystemField() {
		return this.meta.creator === "system";
	}

	/**
	 * Checks if the field is user created field or not
	 * @returns True if field is user created otherwise false
	 */
	isUserField() {
		return this.meta.creator === "user";
	}

	/**
	 * Returns the sub-model of the field only valid for object and object-list field types
	 * @returns Sub-model of the field
	 */
	getSubModel(): ModelBase | null {
		return null;
	}

	/**
	 * Returns the iid of the referenced model. Only valid for reference field types.
	 * @returns Sub-model of the field
	 */
	getRefModelIId(): string {
		return "";
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
		return;
	}

	/**
	 * Adds a validation error entry to the response object
	 * @param {any} response Provides infor about the preparation of the field
	 * @param {any} value Value of the field
	 * @param {string} code The error code
	 * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
	 * @param {boolean} client Whether the error is a client error or a server error
	 */
	addValidationError(
		response: any,
		value: any,
		code: string,
		index: number = -1,
		client: boolean = true
	) {
		const error: any = {};
		error.origin = client ? "client_error" : "server_error";
		error.code = code;
		error.details = {};
		error.details.field = this.getQueryPath();
		if (index >= 0) error.details.index = index;
		if (value !== undefined) error.details.value = value;

		const errors = response.errors;
		if (errors) errors.push(error);
		else {
			response.errors = [];
			response.errors.push(error);
		}
	}

	/**
	 * Prepares field value and updates the field value in `processedData` object. In case of validation errors adds error entries to the `response` object
	 * @param {any} rawValue Raw value of the field
	 * @param {object} processedData The target processed object data where the prepared field value will be set
	 * @param {object} response Provides infor about the preparation of the field
	 * @param {boolean} isCreate Whether this is a create or update operation
	 * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
	 */
	async prepare(
		rawValue: any,
		processedData: any,
		response: any,
		isCreate: boolean = true,
		index: number = -1
	): Promise<any> {
		if (isCreate)
			await this.prepareForCrete(rawValue, processedData, response, index);
		else await this.prepareForUpdate(rawValue, processedData, response, index);
	}

	/**
	 * Prepares field value and updates the field value in `processedData` object for **create** operation. In case of validation errors adds error entries to the `response` object
	 * @param {any} rawValue Raw value of the field
	 * @param {object} processedData The target processed object data where the prepared field value will be set
	 * @param {object} response Provides infor about the preparation of the field
	 * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
	 */
	async prepareForCrete(
		rawValue: any,
		processedData: any,
		response: any,
		index: number
	): Promise<any> {
		// Check if we have any raw input value
		if (rawValue == null || rawValue === undefined) {
			// We do not have any raw input value, check to see if we have a default value for the field
			if (this.hasDefaultValue()) {
				await this.setValue(
					this.getDefaultValue(),
					processedData,
					response,
					true,
					index
				);
			}

			// We do not have an input value and default value check whether the field is required or not
			// If it is not a required field, simply we do not create any value for this field and ignore it
			else if (this.isRequired()) {
				if (this.isUserField()) {
					// This is a required user created field with no default value and no input value, which is an error
					this.addValidationError(
						response,
						rawValue,
						"missing_required_field_value",
						index
					);
				} else {
					// This is a system created field with no default value and no input value, set system generated input values for them
					await this.setValue(rawValue, processedData, response, true, index);
				}
			} else if (
				this.getType() === "object-list" ||
				this.getType() === "basic-values-list"
			) {
				// Assign empty array
				await this.setValue([], processedData, response, true, index);
			} else if (
				this.getType() === "object" &&
				this.hasFieldsWithDefaultValue()
			) {
				// Assign default values of sub-object
				await this.setValue({}, processedData, response, true, index);
			} else return;
		} else {
			// We have a value, process it and update the processedData context
			await this.setValue(rawValue, processedData, response, true, index);
		}
	}

	/**
	 * Prepares field value and updates the field value in `processedData` object for **update** operation. In case of validation errors adds error entries to the `response` object
	 * @param {any} rawValue Raw value of the field
	 * @param {object} processedData The target processed object data where the prepared field value will be set
	 * @param {object} response Provides infor about the preparation of the field
	 * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
	 */
	async prepareForUpdate(
		rawValue: any,
		processedData: any,
		response: any,
		index: number
	): Promise<any> {
		// Check if we have any raw input value
		if (rawValue == null || rawValue === undefined) {
			if (this.isSystemField()) {
				// For a final model (last model in route definition) we cannot update id or createdAt fields but only updatedAt field
				if (this.getType() !== "updatedat") return;

				// This is a system created field with no input value, set system generated input values for them
				await this.setValue(rawValue, processedData, response, false, index);
			} else {
				if (rawValue === null) {
					if (this.isRequired() === false) {
						// We are trying to unset the value of a user field, plaase note that we do not check for undefined
						// Undefined means we did not sent the field value as input to update operation so meaning we do not need to do anything
						await this.setValue(
							rawValue,
							processedData,
							response,
							false,
							index
						);
					} else {
						// This is a required user created field with no input value, which is an error
						this.addValidationError(
							response,
							rawValue,
							"invalid_required_field_value",
							index
						);
					}
				}
			}
		} else {
			// If the field is a read-only user field then skip
			if (this.isReadOnly() && this.isUserField()) return;

			// We have a value, process it and update the processedData context
			await this.setValue(rawValue, processedData, response, false, index);
		}
	}
}
