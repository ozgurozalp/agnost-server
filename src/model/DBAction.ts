import { Model } from "./Model";
import { ActionDefinition, MethodType } from "../utils/types";
import { isString, isObject, isArray } from "../utils/helper";
import { ClientError } from "../utils/ClientError";

/**
 * The database action is primarily used to build database queries or run CRUD operations on a model (i.e., table, collection) of your application.
 *
 * @export
 * @class DBAction
 */
export class DBAction {
	/**
	 * The reference to model object that the database action will be executed.
	 * @protected
	 * @type {string}
	 */
	protected model: Model;

	protected definition: ActionDefinition;

	/**
	 * Creates an instance of DBAction object.
	 * @param {Model} model Reference to the {@link Model} object that this database action will be exectued on.
	 */
	constructor(model: Model) {
		this.model = model;
		this.definition = {
			method: null,
			createData: null,
			select: null,
		};
	}

	/**
	 * Sets the method part of the db action definition
	 * @param {MethodType} method The method that will be executed
	 */
	setMethod(method: MethodType) {
		this.definition.method = method;
	}

	/**
	 * Sets the select part of the db action definition
	 * @param {string} select The names of the fields to include in returned objects
	 */
	setSelect(select: string | null | undefined) {
		if (!select) return;

		if (!isString(select))
			throw new ClientError(
				"invalid_value",
				`Select option needs to specify the names of the fiels to return, either a single field name or space separated list of field names e.g., 'name email profile.age'`
			);

		this.definition.select = select;
	}

	/**
	 * Sets the createData part of the db action definition
	 * @param {object | object[]} createData The object(s) that will be created in the database
	 */
	setCreateData(createData: object | object[]) {
		if (!createData) {
			throw new ClientError(
				"invalid_value",
				`The data to create in the database table/collection needs to be provided`
			);
		}

		if (!isObject(createData) && !isArray(createData))
			throw new ClientError(
				"invalid_value",
				`The data to create in the database table/collection needs to be a single or an array of JSON objects`
			);

		this.definition.createData = createData;
	}
}
