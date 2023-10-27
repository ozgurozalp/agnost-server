import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the hour part of a date as a number between 0 and 23
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("hour", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$hour",
				PostgreSQL: "EXTRACT",
				MySQL: "EXTRACT",
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
				return `EXTRACT(HOUR FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)}::TIMESTAMP)`;
			case DBTYPE.MYSQL:
				return `EXTRACT(HOUR FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)})`;
			default:
				return null;
		}
	}
}
