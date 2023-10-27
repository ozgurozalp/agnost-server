import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the month of a date as a number between 1 and 12
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("month", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$month",
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
				return `EXTRACT(MONTH FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)}::DATE)`;
			case DBTYPE.MYSQL:
				return `EXTRACT(MONTH FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)})`;
			default:
				return null;
		}
	}
}
