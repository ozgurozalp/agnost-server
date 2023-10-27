import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Defines logical not function
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("not", {
			paramCount: 1,
			returnType: ReturnType.BOOLEAN,
			params: ReturnType.BOOLEAN,
			mapping: {
				MongoDB: "$not",
				PostgreSQL: "NOT",
				MySQL: "NOT",
			},
		});
	}

	/**
	 * Returns the database specific query structure of the where condition
	 * @param {string} dbType The database type
	 * @returns Query structure
	 */
	getQuery(dbType: string, callback?: (fieldPath: string) => string): any {
		switch (dbType) {
			case DBTYPE.MONGODB:
				return super.getQuery(dbType, callback);
			case DBTYPE.POSTGRESQL:
			case DBTYPE.MYSQL:
				return `NOT (${this.parameters[0].getQuery(dbType, callback)})`;
			default:
				return null;
		}
	}
}
