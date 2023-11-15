import { APIBase } from "../APIBase";
import { ClientError } from "../utils/ClientError";
import { TaskInfo } from "../utils/types";
import { TaskName } from "../utils/specifics";

/**
 * The Task object allows you to manually trigger your scheduled tasks (e.g., cron jobs) which actually ran periodically at fixed times, dates, or intervals.
 *
 * Typically, a scheduled task runs according to its defined execution schedule. However, with Agnost's server-side client API by calling the {@link run} method, you can manually run scheduled tasks ahead of their actual execution schedule.
 *
 * @export
 * @class Task
 */
export class Task<T extends TaskName> extends APIBase {
	/**
	 * The name of the cron job
	 * @protected
	 * @type {string}
	 */
	protected name: T;

	/**
	 * The metadata of the cron job object
	 * @protected
	 * @type {string}
	 */
	protected meta: any;

	/**
	 * The resource adapter of the task object
	 * @protected
	 * @type {any}
	 */
	protected adapter: any;

	/**
	 * Creates an instance of task object to trigger execution of scheduled tasks.
	 * @param {any} metaManager Provides access to the application the version configuration
	 * @param {any} adapterManager Provides access to actual resource adapters and drivers
	 * @param {string} name The name of the task (cron job)
	 * @throws Throws an exception if metada or adapter of task (cron job) object cannot be found
	 */
	constructor(metaManager: any, adapterManager: any, name: T) {
		super(metaManager, adapterManager);
		this.name = name;
		// Get the metadata of the cron job
		this.meta = this.getMetadata("task", name);
		if (!this.meta) {
			throw new ClientError(
				"cronjob_not_found",
				`Cannot find the cron job object identified by name '${name}'`
			);
		}

		// Get the adapter of the cron job
		this.adapter = this.getAdapter("task", this.name);
		if (!this.adapter) {
			throw new ClientError(
				"adapter_not_found",
				`Cannot find the adapter of the cron job named '${name}'`
			);
		}
	}

	/**
	 * Triggers the execution of the specified schedule task. After the task is triggered, the handler method defined in your task (cron job) configuration is invoked. This handler method executes the task and performs necessary actions.
	 *
	 * @returns If successful, returns information about the triggered task. You can use `trackingId` to check the execution status of your task by calling {@link getTaskStatus} method. In case of errors, returns the errors that occurred.
	 */
	async run(): Promise<TaskInfo> {
		const trackingObj: TaskInfo = await this.adapter.triggerCronJob(this.meta);

		return trackingObj;
	}

	/**
	 * Gets the latest execution status of the task. The last seven days task execution logs are kept. If you try to get the status of a task that has been triggered earlier, this method returns `null` for {@link TaskInfo}.
	 *
	 * @param {string} trackingId The id of the task
	 * @returns If successful, returns status information about the triggered task
	 */
	async getTaskStatus(trackingId: string): Promise<TaskInfo> {
		const trackingObj: TaskInfo = await this.adapter.getTaskTrackingRecord(
			this.meta.iid,
			trackingId
		);

		return trackingObj;
	}
}
