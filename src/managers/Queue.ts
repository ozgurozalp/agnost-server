import { APIBase } from "../APIBase";
import { ClientError } from "../utils/ClientError";
import { MessageInfo } from "../utils/types";

/**
 * The queue allows different parts of your application to communicate and perform activities asynchronously.
 *
 * A message queue provides a buffer that temporarily stores messages and dispatches them to their consuming service. The messages are usually small, and can be things like requests, replies or error messages, etc.
 *
 * By calling the {@link submitMessage} method, you can manually send messages to the specified queue for processing.
 *
 * @export
 * @class Queue
 */
export class Queue extends APIBase {
	/**
	 * The name of the queue
	 * @protected
	 * @type {string}
	 */
	protected name: string;

	/**
	 * The metadata of the queue object
	 * @protected
	 * @type {any}
	 */
	protected meta: any;

	/**
	 * The resource adapter of the queue object
	 * @protected
	 * @type {any}
	 */
	protected adapter: any;

	/**
	 * Creates an instance of queue object to send messages for asynchronous processing.
	 * @param {any} metaManager Provides access to the application the version configuration
	 * @param {any} adapterManager Provides access to actual resource adapters and drivers
	 * @param {string} name The name of the queue
	 * @throws Throws an exception if metada or adapter of queue object cannot be found
	 */
	constructor(metaManager: any, adapterManager: any, name: string) {
		super(metaManager, adapterManager);
		this.name = name;
		// Get the metadata of the queue
		this.meta = this.getMetadata("queue", name);
		if (!this.meta) {
			throw new ClientError(
				"queue_not_found",
				`Cannot find the queue object identified by name '${name}'`
			);
		}

		// Get the adapter of the queue
		this.adapter = this.getAdapter("queue", this.name);
		if (!this.adapter) {
			throw new ClientError(
				"adapter_not_found",
				`Cannot find the adapter of the queue named '${name}'`
			);
		}
	}

	/**
	 * Submits a message to the specified message queue for asychronous processing. After the message is submitted, the handler code defined in your message queue configuration is invoked. This routed service processes the input message and performs necessary tasks defined in its handler code.
	 *
	 * You can also specify a delay in milliseconds between message submission to the queue and routed handler code invocation. As an example, you would like to send a welcome email to your new users when they sign up. Instead of sending this email immediately after sign up, you can send it 24 hours later (e.g., 60 x 60 x 24 x 1000 = 86400000 milliseconds)
	 *
	 * @param {object} message The message payload (JSON object) that will be submitted to the message queue
	 * @param {number} delay The number of milliseconds to delay the messages in queue before dispacthing them to their handler
	 * @returns If successful, returns information about the submitted message. You can use `trackingId` to check the processing status of your message by calling {@link getMessageStatus} method. In case of an errors, returns the errors that occurred.
	 */
	async submitMessage(message?: object, delay?: number): Promise<MessageInfo> {
		const trackingObj: MessageInfo = await this.adapter.sendMessage(
			this.meta,
			message,
			delay ?? 0
		);

		return trackingObj;
	}

	/**
	 * Gets the latest status of the message. The last seven days message queue logs are kept. If you try to get the status of a message that has been submitted earlier, this method returns `null` for {@link MessageInfo}.
	 *
	 * @param {string} trackingId The id of the message
	 * @returns If successful, returns status information about the submitted message
	 */
	async getMessageStatus(trackingId: string): Promise<MessageInfo> {
		const trackingObj: MessageInfo =
			await this.adapter.getMessageTrackingRecord(this.meta.iid, trackingId);

		return trackingObj;
	}
}
