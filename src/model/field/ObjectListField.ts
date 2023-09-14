import { ModelBase } from "../ModelBase";
import { Field } from "../Field";
import { ClientError } from "../../utils/ClientError";

/**
 * The ObjectList field. This field type is only applicable for no-sql databases.
 *
 * @export
 * @class Field
 */
export class ObjectListField extends Field {
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

		const subModelMeta: any = model
			.getDb()
			.getModelMetaByIId(meta.objectList.iid);
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
			processedData[this.getName()] = [];
			return;
		}

		// Setting the value of the field. We cannot directly set the object list field but we can push or pull objects to it
		if (!isCreate && Array.isArray(value)) {
			return this.addValidationError(
				response,
				value,
				"direct_array_assignment_not_allowed",
				index
			);
		}

		if (!Array.isArray(value)) {
			return this.addValidationError(response, value, "not_array_value", index);
		}

		for (const item of value) {
			if (typeof item !== "object" || Array.isArray(item)) {
				return this.addValidationError(
					response,
					item,
					"invalid_object_array_entry",
					index
				);
			}
		}

		if (isCreate) processedData[this.getName()] = [];
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
		await super.prepare(rawValue, processedData, response, isCreate, index);
		if (isCreate) {
			rawValue = rawValue ? rawValue : [];
			for (let i = 0; i < rawValue.length; i++) {
				const entry = rawValue[i];
				const prepResult = await this.subModel.prepareFieldValues(
					entry,
					isCreate,
					response,
					i
				);

				processedData[this.getName()].push(prepResult);
			}
		}
	}
}
