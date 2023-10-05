import { APIBase } from "../APIBase";
import { ClientError } from "../utils/ClientError";
import { checkRequired } from "../utils/helper";

/**
 * The realtime manager allows realtime messaging through websockets.
 *
 * @export
 * @class RealtimeManager
 */
export class Realtime extends APIBase {
  /**
   * The metadata of the function object
   * @protected
   * @type {string}
   */
  protected meta: any;

  /**
   * The resource adapter of the function
   * @protected
   * @type {any}
   */
  protected adapter: any;

  /**
   * Creates an instance of function object to run custom helper functions.
   * @param {any} metaManager Provides access to the application the version configuration
   * @param {any} adapterManager Provides access to actual resource adapters and drivers
   * @param {string} name The name of the function
   * @throws Throws an exception if metada or adapter of function object cannot be found
   */
  constructor(adapterManager: any) {
    super(null, adapterManager);
    // Get the adapter of the function
    this.adapter = this.getAdapter("realtime", null);
    if (!this.adapter) {
      throw new ClientError(
        "adapter_not_found",
        `Cannot find the adapter for realtime`,
      );
    }
  }

  /**
   * Sends the message identified by the `eventName` to all connected members of the app. All serializable datastructures are supported for the `message`, including `Buffer`.
   *
   * @param {string} eventName The name of the event.
   * @param {any} message The message payload/contents.
   * @returns {void}
   * @throws Throws an exception if `eventName` is not specified
   */
  broadcast(eventName: string, message: any): void {
    if (!checkRequired(eventName, true))
      throw new ClientError(
        "invalid_value",
        `The 'event name' needs to be a string value`,
      );
    this.adapter.broadcast(eventName, message);
  }

  /**
   * Sends the message identified by the `eventName` to the provided channel members only. All serializable datastructures are supported for the `message`, including `Buffer`.
   *
   * @param {string} channel The name of the channel.
   * @param {string} eventName The name of the event.
   * @param {any} message The message payload/contents.
   * @returns {void}
   * @throws Throws an exception if `channel` or `eventName` is not specified
   */
  send(channel: string, eventName: string, message: any): void {
    if (!checkRequired(channel, true))
      throw new ClientError(
        "invalid_value",
        `The 'channel name' needs to be a string value`,
      );

    if (!checkRequired(eventName, true))
      throw new ClientError(
        "invalid_value",
        `The 'event name' needs to be a string value`,
      );

    this.adapter.send(channel, eventName, message);
  }

  /**
   * Returns the members of the specified channel.
   *
   * @param {string} channel The name of the channel.
   * @returns Returns array of channel member data. If no channel members then returns and empty array []
   * @throws Throws an exception if `channel` is not specified
   */
  async getMembers(channel: string): Promise<object[]> {
    if (!checkRequired(channel, true))
      throw new ClientError(
        "invalid_value",
        `The 'channel name' needs to be a string value`,
      );

    return await this.adapter.getMembers(channel);
  }
}
