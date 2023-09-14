import { Field } from "../../model/Field";
import { ModelBase } from "../../model/ModelBase";
import { FieldValue } from "./FieldValue";
import { ExpressionType } from "../../utils/types";

/**
 * Defines a model field value
 *
 * @export
 * @class Expression
 */
export class ArrayFilterFieldValue extends FieldValue {
	constructor(
		field: Field,
		fieldPath: string,
		joinType: string,
		joinModel: ModelBase
	) {
		super(field, fieldPath, joinType, joinModel);
	}

	/**
	 * Returns the expression type
	 * @returns Expression type
	 */
	getExpressionType(): ExpressionType {
		return ExpressionType.ARRAY_FIELD;
	}

	/**
	 * Validates the expression for $pull update operation. If expression is not valid throwns an exception.
	 * @param {string} dbType The database type
	 */
	validateForPull(dbType: string): void {
		return;
	}
}
