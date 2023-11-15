import { ModelBase } from "../ModelBase";
import { Field } from "../Field";
import { DBTYPE } from "../../utils/types";
import { isValidId, isString, isInteger, objectId } from "../../utils/helper";

/**
 * The Id (Unique Identifier) field
 *
 * @export
 * @class Field
 */
export class IdField extends Field {
  /**
   * Creates an instance of the field object.
   * @param {any} meta Provides access to the application the version configuration
   * @param {ModelBase} model Reference to the {@link ModelBase} of the field
   */
  constructor(meta: any, model: ModelBase) {
    super(meta, model);
  }

  /**
   * Assigns the value of the field. This method is overriden by the fhe specific field classes
   * @param {object} value Value of the field
   * @param {object} processedData The target processed object data where the prepared field value will be set
   * @param {object} response Provides infor about the preparation of the field
   * @param {boolean} isCreate Whether this is a create or update operation
   * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
   * @throws Throws an exception if the field value cannot pass validation rules
   */
  async setValue(
    value: any,
    processedData: any,
    response: any,
    isCreate: boolean = true,
    index: number = -1,
  ): Promise<any> {
    // If no value specified or if it is update operation then skip this field
    if (!value || !isCreate) return;

    // Check whether id value is a valid MongoDB id or not
    if (this.getDBType() === DBTYPE.MONGODB) {
      const processedValue = value.toString().trim();

      if (!isValidId(processedValue, DBTYPE.MONGODB)) {
        return this.addValidationError(
          response,
          value,
          "invalid_id_value",
          index,
        );
      }
      processedData[this.getName()] = objectId(processedValue);
    } else {
      if (!isString(value) && !isInteger(value)) {
        return this.addValidationError(
          response,
          value,
          "invalid_id_value",
          index,
        );
      }

      processedData[this.getName()] = value;
    }
  }
}
