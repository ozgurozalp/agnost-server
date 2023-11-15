# Changelog

All notable changes to this project are documented in this file.

### 1.4.4 (2023-10-27)

-  Minor bug fixes
-  Renamed `getSQLQuery` method to `getSQLSubQuery

### 1.4.3 (2023-10-27)

-  Added support for MySQL databases
-  Added `getSQLQuery` method to Model module to get the SQL query string based on the method input parameters

### 1.4.2 (2023-10-09)

-  Added `getClient` method to Cache module to access the Redis client driver to perform advanced operations

### 1.4.1 (2023-10-06)

-  Fixed uppercase function name bug in Function manager

### 1.4.0 (2023-10-05)

-  Added the realtime methods to broadcast and send messages to a channel through websockets

### 1.3.0 (2023-10-01)

-  Added the new updateOne and deleteOne methods to database model manager and renamed update and delete methods to updateMany and deleteMany respectively

### 1.2.0 (2023-09-22)

-  Added the module to manage application cache (e.g, managing key-value pairs in Redis)

### 1.1.0 (2023-09-20)

-  Added the module to call custom helper functions defined in Agnost Studio

### 1.0.0 (2023-09-19)

-  Initial version of Agnost server-side client library
