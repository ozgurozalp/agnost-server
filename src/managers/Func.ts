import { APIBase } from "../APIBase";
import { ClientError } from "../utils/ClientError";
import { FunctionName } from "../utils/specifics";

/**
 * The Function object allows you to run your customer helper functions.
 *
 * @export
 * @class Func
 */
export class Func<F extends FunctionName> extends APIBase {
	/**
	 * The name of the function
	 * @protected
	 * @type {string}
	 */
	protected name: F;

	/**
	 * The metadata of the function object
	 * @protected
	 * @type {string}
	 */
	protected meta: any;

	/**
	 * The resource adapter of the function
	 * @protected
	 * @type {any}
	 */
	protected adapter: any;

	/**
	 * Creates an instance of function object to run custom helper functions.
	 * @param {any} metaManager Provides access to the application the version configuration
	 * @param {any} adapterManager Provides access to actual resource adapters and drivers
	 * @param {string} name The name of the function
	 * @throws Throws an exception if metada or adapter of function object cannot be found
	 */
	constructor(metaManager: any, adapterManager: any, name: F) {
		super(metaManager, adapterManager);
		this.name = name;
		// Get the metadata of the function
		this.meta = this.getMetadata("function", name);
		if (!this.meta) {
			throw new ClientError(
				"function_not_found",
				`Cannot find the function identified by name '${name}'`
			);
		}

		// Get the adapter of the function
		this.adapter = this.getAdapter("function", this.name);
		if (!this.adapter) {
			throw new ClientError(
				"adapter_not_found",
				`Cannot find the adapter of the function named '${name}'`
			);
		}
	}

	/**
	 * Runs the custom helper function. You can call this method with any number of parameters, yet, the parameter structure ideally needs to match with your helper function parameter definitions.
	 *
	 * @returns If successful, returns the output of helper function.
	 * @throws Throws an exception if the helper function cannot be executed.
	 */
	async run(...args: any[]): Promise<any> {
		return await this.adapter.run(this.name, ...args);
	}
}
