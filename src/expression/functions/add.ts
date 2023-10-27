import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Adds numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("add", {
			paramCount: -1,
			returnType: ReturnType.NUMBER,
			params: ReturnType.NUMBER,
			mapping: {
				MongoDB: "$add",
				PostgreSQL: "+",
				MySQL: "+",
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
				const funcParams = [];
				for (const entry of this.parameters) {
					funcParams.push(entry.getQuery(dbType, callback));
				}

				return `(${funcParams.join(" + ")})`;
			default:
				return null;
		}
	}
}
