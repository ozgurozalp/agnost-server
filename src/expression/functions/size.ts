import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Counts and returns the total number of items in an array
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("size", {
			paramCount: 1,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.ARRAY],
			mapping: {
				MongoDB: "$custom",
				PostgreSQL: "n/a",
				MySQL: "n/a",
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
					$size: {
						$ifNull: [this.parameters[0].getQuery(dbType, callback), []],
					},
				};

				return null;
		}
	}
}
