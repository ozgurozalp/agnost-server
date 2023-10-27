import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the day of the month for a date as a number between 1 and 31
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("dayOfMonth", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.DATE],
			mapping: {
				MongoDB: "$dayOfMonth",
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
				return `EXTRACT(DAY FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)}::DATE)`;
			case DBTYPE.MYSQL:
				return `EXTRACT(DAY FROM ${this.parameters[0].getQuery(
					dbType,
					callback
				)})`;
			default:
				return null;
		}
	}
}
