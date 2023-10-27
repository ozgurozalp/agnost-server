import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the substring of a string. The substring starts with the character at the specified index (zero-based) in the string for the number of characters (count) specified.
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("substring", {
			paramCount: 3,
			returnType: ReturnType.TEXT,
			params: [ReturnType.TEXT, ReturnType.NUMBER, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$substrCP",
				PostgreSQL: "SUBSTRING",
				MySQL: "SUBSTRING",
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
				return `SUBSTRING(${this.parameters[0].getQuery(
					dbType,
					callback
				)} FROM ${this.parameters[1].getQuery(
					dbType,
					callback
				)} + 1 FOR ${this.parameters[2].getQuery(dbType, callback)})`;
			case DBTYPE.MYSQL:
				return `SUBSTRING(${this.parameters[0].getQuery(
					dbType,
					callback
				)}, ${this.parameters[1].getQuery(
					dbType,
					callback
				)} + 1, ${this.parameters[2].getQuery(dbType, callback)})`;
			default:
				return null;
		}
	}
}
