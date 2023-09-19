import { APIBase } from "./APIBase";
import { Storage } from "./managers/Storage";
import { Queue } from "./managers/Queue";
import { Task } from "./managers/Task";
import { Database } from "./managers/Database";
import { isString } from "./utils/helper";
import { ClientError } from "./utils/ClientError";
import {
  QueueName,
  TaskName,
  DatabaseName,
  StorageName,
} from "./utils/specifics";

/**
 * Javascript server-side client for interacting with your Agnost platform backend application resource adapters/drivers.
 *
 * > Please note that this library can only be used in the backend of your Agnost applications and cannot be used in your front-end apps.
 * > You do not need to create a new instance of **AgnostServerSideClient**, since an instance will be globally available in your Agnost backend apps with the identifier `agnost`. Through this identifier you can access your application's resource managers (e.g., database, storage) and perform actions on these resources (e.g., insert a record to a database taple, save a file to a storage bucket)
 *
 * AgnostServerSideClient is the main object that you will be using to issue commands to your backend apps. The commands that you can run are grouped below:
 * * {@link storage}: {@link Storage} - Store and manage your buckets and objects (e.g., documents, files, images)
 *
 * @export
 * @class AgnostServerSideClient
 */
export class AgnostServerSideClient extends APIBase {
  /**
   * Provides access to actual resource adapters and drivers
   * @protected
   * @type {any}
   */
  protected managers: Map<string, any>;

  /**
   * Create a new server-side client instance to use in backend apps. You do not need to create a new instance of AgnostServerSideClient, since an instance will be globally available in your Agnost backend apps with the identifier `agnost`
   * @param {any} metaManager Provides access to the application the version configuration
   * @param  {any} adapterManager Provides access to actual resource adapters and drivers. AgnostServerSideClient will be proxying adapter methods.
   */
  constructor(metaManager: any, adapterManager: any) {
    super(metaManager, adapterManager);
    this.managers = new Map();
  }

  /**
   * Returns the storage object which is used to manage buckets and files of the storage identified by its name. An Agnost app can use several storages from different providers such as AWS S3, GCP Cloud Storage or the Agnost cluster default storage MinIO. The name of the storage identifies the actual storage provider that you will be using to manage your app buckets and files.
   * @param {string} name The name of the storage
   * @returns Returns the {@link Storage}
   */
  storage<S extends StorageName>(name: S): Storage<S> {
    // Check the validity of input parameters
    if (!isString(name))
      throw new ClientError(
        "invalid_value",
        `Storage name needs to be a string value`,
      );
    // Check if there is a cached instance or not, if yes then return the cached instance if not create a new instance
    const storage: Storage<S> = this.managers.get(`storage-${name}`);
    if (storage) return storage;
    else {
      const newStorage = new Storage(
        this.metaManager,
        this.adapterManager,
        name,
      );
      this.managers.set(`storage-${name}`, newStorage);
      return newStorage;
    }
  }

  /**
   * Returns the queue object which is used to submit messages to a message queue for processing. An Agnost app can use several queues from different message brokers such as RabbitMQ and Kafka. The name of the queue identifies the actual message broker that you will be using to submit messages for asyncronous processing.
   * @param {string} name The name of the queue
   * @returns Returns the {@link Queue}
   */
  queue<Q extends QueueName>(name: Q): Queue<Q> {
    // Check the validity of input parameters
    if (!isString(name))
      throw new ClientError(
        "invalid_value",
        `Queue name needs to be a string value`,
      );
    // Check if there is a cached instance or not, if yes then return the cached instance if not create a new instance
    const queue: Queue<Q> = this.managers.get(`queue-${name}`);
    if (queue) return queue;
    else {
      const newQueue = new Queue(this.metaManager, this.adapterManager, name);
      this.managers.set(`queue-${name}`, newQueue);
      return newQueue;
    }
  }

  /**
   * Returns the task manager which is used to trigger scheduled tasks (e.g., cron jobs) for execution.
   * @param {string} name The name of the cron job
   * @returns Returns the {@link Task}
   */
  task<T extends TaskName>(name: T): Task<T> {
    // Check the validity of input parameters
    if (!isString(name))
      throw new ClientError(
        "invalid_value",
        `Task name needs to be a string value`,
      );
    // Check if there is a cached instance or not, if yes then return the cached instance if not create a new instance
    const task: Task<T> = this.managers.get(`task-${name}`);
    if (task) return task;
    else {
      const newTask = new Task(this.metaManager, this.adapterManager, name);
      this.managers.set(`task-${name}`, newTask);
      return newTask;
    }
  }

  /**
   * Returns the database manager which is used to perform CRUD operaitons on the database
   * @param {string} name The name of the database
   * @returns Returns the {@link Database}
   */
  db<D extends DatabaseName>(name: D): Database<D> {
    // Check the validity of input parameters
    if (!isString(name))
      throw new ClientError(
        "invalid_value",
        `Database name needs to be a string value`,
      );
    // Check if there is a cached instance or not, if yes then return the cached instance if not create a new instance
    const db: Database<D> = this.managers.get(`db-${name}`);
    if (db) return db;
    else {
      const newDb = new Database(this.metaManager, this.adapterManager, name);
      this.managers.set(`db-${name}`, newDb);
      return newDb;
    }
  }
}
