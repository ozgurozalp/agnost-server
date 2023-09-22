import { ModelBase } from "../ModelBase";
import { Field } from "../Field";

const HELPER = (global as any).helper;

/**
 * The EncryptedText field
 *
 * @export
 * @class Field
 */
export class EncryptedTextField extends Field {
  /**npm
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
    if (!isCreate && this.isReadOnly()) return;

    // Unsetting the value of the field
    if (!isCreate && value === null && this.isRequired() === false) {
      processedData[this.getName()] = null;
    }

    if (
      (typeof value === "object" && Array.isArray(value) === false) ||
      Array.isArray(value)
    ) {
      return this.addValidationError(response, value, "not_text_value", index);
    }

    // We need to call toString function to convert value to string, since number values can also be provided as a value
    let processedValue = value.toString();

    if (processedValue === "" && this.isRequired()) {
      return this.addValidationError(
        response,
        processedValue,
        "invalid_required_field_value",
        index,
      );
    }

    // Check max length constraint
    const config = this.meta.encryptedText;
    if (processedValue.length > config.maxLength) {
      return this.addValidationError(
        response,
        processedValue,
        "max_length_threshold_exceeded",
        index,
      );
    }

    // We cannot encrypt null or empty string values
    if (
      processedValue === null ||
      processedValue === undefined ||
      processedValue === ""
    )
      return;

    // Encrypt field value, this consumes some good time of compute resurces
    processedValue = await HELPER.encryptText(processedValue);

    processedData[this.getName()] = processedValue;
  }
}