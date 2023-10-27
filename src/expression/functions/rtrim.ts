import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Removes whitespace characters (e.g., spaces) from the end of a string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("rtrim", {
			paramCount: 1,
			returnType: ReturnType.TEXT,
			params: [ReturnType.TEXT],
			mapping: {
				MongoDB: "$custom",
				PostgreSQL: "RTRIM",
				MySQL: "RTRIM",
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
					$rtrim: { input: this.parameters[0].getQuery(dbType, callback) },
				};
			case DBTYPE.POSTGRESQL:
			case DBTYPE.MYSQL:
				return super.getQuery(dbType, callback);
			default:
				return null;
		}
	}
}
