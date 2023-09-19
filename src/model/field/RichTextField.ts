import { ModelBase } from "../ModelBase";
import { Field } from "../Field";

/**
 * The RichText field
 *
 * @export
 * @class Field
 */
export class RichTextField extends Field {
  /**
   * Creates an instance of the field object.
   * @param {any} meta Provides access to the application the version configuration
   * @param {ModelBase} model Reference to the {@link ModelBase} of the field
   */
  constructor(meta: any, model: ModelBase) {
    super(meta, model);
  }

  /**
   * Returns true if the field is searchable
   * @returns Type of the model
   */
  isSearchable(): boolean {
    return this.meta.richText?.searchable;
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
    if (!isCreate && this.isReadOnly()) return;

    // Unsetting the value of the field
    if (!isCreate && value === null && this.isRequired() === false) {
      processedData[this.getName()] = null;
      return;
    }

    if (
      (typeof value === "object" && Array.isArray(value) === false) ||
      Array.isArray(value)
    ) {
      return this.addValidationError(response, value, "not_text_value", index);
    }

    // We need to call toString function to convert value to string, since number values can also be provided as a value
    const processedValue = value.toString();

    if (processedValue === "" && this.isRequired()) {
      return this.addValidationError(
        response,
        processedValue,
        "invalid_required_field_value",
        index,
      );
    }

    processedData[this.getName()] = processedValue;
  }
}
