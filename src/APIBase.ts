import { MetaType } from "./utils/types";

/**
 * The base class where all manager classes are derived from.
 *
 * All manager classes interact with your app backend app resources through their adapters. This base class keeps a reference to the server side client object which provides access to resource adapters and application metadata.
 *
 * @export
 * @class APIBase
 */
export class APIBase {
  /**
   * Meta data manager which provides access to version configuration information
   * @protected
   * @type {any}
   */
  protected metaManager: any;

  /**
   * Provides access to actual resource adapters and drivers
   * @protected
   * @type {any}
   */
  protected adapterManager: any;

  /**
   * Creates an instance of base class to access services exposed by application resources
   * @param {any} metaManager Provides access to the application the version configuration
   * @param {any} adapterManager Provides access to actual resource adapters and drivers
   */
  constructor(metaManager: any, adapterManager: any) {
    this.metaManager = metaManager;
    this.adapterManager = adapterManager;
  }

  /**
   * Returns the metadata of the object.
   * @param {string} type The type of the object
   * @param {string} name The name of the object
   * @returns Metadata JSON object
   */
  protected getMetadata(type: MetaType, name: string): any {
    switch (type) {
      case "database":
        return this.metaManager.getDatabaseByName(name);
      case "queue":
        return this.metaManager.getQueueByName(name);
      case "task":
        return this.metaManager.getTaskByName(name);
      case "storage":
        return this.metaManager.getStorageByName(name);
      case "function":
        return this.metaManager.getFunctionByName(name);
      case "cache":
        return this.metaManager.getCacheByName(name);
      default:
        return null;
    }
  }

  /**
   * Returns the adapter of the resource. For databases and caches it does not directly return the driver itself but the overall adapter object which might also hold read-only adapter objects.
   * @param {string} type The type of the object
   * @param {string} name The name of the object
   * @returns Metadata JSON object
   */
  protected getAdapter(type: MetaType, name: string | null): any {
    switch (type) {
      case "database":
        return this.adapterManager.getDatabaseAdapter2(name);
      case "queue":
        return this.adapterManager.getQueueAdapter(name);
      case "task":
        return this.adapterManager.getTaskAdapter(name);
      case "storage":
        return this.adapterManager.getStorageAdapter(name);
      case "function":
        return this.adapterManager.getFunctionAdapter();
      case "cache":
        return this.adapterManager.getCacheAdapter2(name);
      case "realtime":
        return this.adapterManager.getRealtimeAdapter();
      default:
        return null;
    }
  }
}
