import { ModelBase } from "../ModelBase";
import { Field } from "../Field";
import { ClientError } from "../../utils/ClientError";

/**
 * The Object field. This field type is only applicable for no-sql databases.
 *
 * @export
 * @class Field
 */
export class ObjectField extends Field {
	/**
	 * The reference to the sub model object of this field
	 * @protected
	 * @type {string}
	 */
	protected subModel: ModelBase;

	/**
	 * Creates an instance of the field object.
	 * @param {any} meta Provides access to the application the version configuration
	 * @param {ModelBase} model Reference to the {@link ModelBase} of the field
	 */
	constructor(meta: any, model: ModelBase) {
		super(meta, model);

		const subModelMeta: any = model.getDb().getModelMetaByIId(meta.object.iid);
		if (!subModelMeta) {
			throw new ClientError(
				"submodel_not_found",
				`Cannot find the sub-model of the field '${
					meta.name
				}' in model '${model.getName()}' in database '${model
					.getDb()
					.getName()}'`
			);
		}

		this.subModel = new ModelBase(subModelMeta, model, model.getDb());
		// Add this sub model to the models list of the database
		model
			.getDb()
			.addSubModel(
				subModelMeta.parentHierarchy.map((entry: any) => entry.name).join("."),
				this.subModel
			);
	}

	/**
	 * Returns the sub-model of the field only valid for object and object-list field types
	 * @returns Sub-model of the field
	 */
	getSubModel(): ModelBase | null {
		return this.subModel;
	}

	/**
	 * Returns true if the field is searchable
	 * @returns Type of the model
	 */
	isSearchable(): boolean {
		return this.subModel.hasSearchIndex();
	}

	/**
	 *  Mainly used for sub-model object fields to understand if they have any fields with a default value expression
	 * @returns True if sub-model field has fields with default values
	 */
	hasFieldsWithDefaultValue() {
		if (!this.subModel) return false;

		const fields = this.subModel.getFields();
		for (const field of fields.values()) {
			if (field.hasDefaultValue()) return true;
			if (field.getType() === "object") {
				return field.hasFieldsWithDefaultValue();
			}
		}

		return false;
	}

	/**
	 *  Mainly used for sub-model object fields to understand if they have any required fields
	 * @returns True if sub-model field has required fields
	 */
	hasRequiredFields() {
		if (!this.subModel) return false;

		const fields = this.subModel.getFields();
		for (const field of fields.values()) {
			if (field.isRequired()) return true;
			if (field.getType() === "object") {
				return field.hasRequiredFields();
			}
		}

		return false;
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
		// Unsetting the value of the field
		if (!isCreate && value === null && this.isRequired() === false) {
			processedData[this.getName()] = null;
			return;
		}

		// Setting the value of the field. We cannot directly set the object field but we can update its fields individually
		if (!isCreate && value) {
			return this.addValidationError(
				response,
				value,
				"direct_object_assignment_not_allowed",
				index
			);
		}

		if (typeof value !== "object" || Array.isArray(value)) {
			return this.addValidationError(
				response,
				value,
				"not_object_value",
				index
			);
		}

		if (isCreate) processedData[this.getName()] = {};
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
		await super.prepare(rawValue, processedData, response, isCreate);
		if (isCreate) {
			const prepResult = await this.subModel.prepareFieldValues(
				rawValue ? rawValue : {},
				isCreate,
				response,
				index
			);

			processedData[this.getName()] = prepResult;
		}
	}
}
