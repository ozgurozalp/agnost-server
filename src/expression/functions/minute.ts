import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the minute part of a date as an integer between 0 and 59
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("minute", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$minute",
				PostgreSQL: "$custom",
				MySQL: "$custom",
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
				return super.getQuery(dbType, callback);
			case DBTYPE.POSTGRESQL:
				return `EXTRACT(MINUTE FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)}::TIMESTAMP)`;
			case DBTYPE.MYSQL:
				return `EXTRACT(MINUTE FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)})`;
			default:
				return null;
		}
	}
}
