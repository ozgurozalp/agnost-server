import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Converts a date & time string in a specific format to a date & time value
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("strToDate", {
			paramCount: 1,
			returnType: ReturnType.DATE,
			params: ReturnType.TEXT,
			mapping: {
				MongoDB: "$custom",
			},
		});
	}

	/**
	 * Returns the database specific query structure of the where condition
	 * @param {string} dbType The database type
	 * @returns Query structure
	 */
	getQuery(dbType: string, callback: (fieldPath: string) => string): any {
		switch (dbType) {
			case DBTYPE.MONGODB:
				return {
					$dateFromString: {
						dateString: this.parameters[0].getQuery(dbType, callback),
						format: "%Y-%m-%d %H:%M:%S",
					},
				};
			default:
				return null;
		}
	}
}
