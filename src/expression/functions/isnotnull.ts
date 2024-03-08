import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 *  Checks if the value exists or not
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("isnotnull", {
			paramCount: 1,
			returnType: ReturnType.BOOLEAN,
			params: ReturnType.ANY,
			mapping: {
				MongoDB: "$custom",
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
				return {
					$ne: [this.parameters[0].getQuery(dbType, callback), null],
				};
			case DBTYPE.POSTGRESQL:
			case DBTYPE.MYSQL:
				const queryStr = this.parameters[0].getQuery(dbType, callback);
				if (queryStr.startsWith("'") && queryStr.endsWith("'")) {
					return `${queryStr.slice(1, -1)} IS NOT NULL`;
				}
				return `${queryStr} IS NOT NULL`;
			default:
				return null;
		}
	}
}
