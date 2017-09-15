/**
 * Created by luisandresgurmendez on 15/9/17.
 */

var configuration={};
configuration.sql={};
configuration.sql.user="CREATE TABLE IF NOT EXISTS User (userId integer primary key autoincrement, username text, house text)";
configuration.sql.prediction="CREATE TABLE IF NOT EXISTS Prediction (predictionId integer primary key autoincrement, character text, status text, killedBy text, chapter integer, userId integer, FOREIGN KEY (userId) REFERENCES User(userId))";
// Group es una palabra reservada de SQL de "Group By" hay que poner entra []
configuration.sql.group="CREATE TABLE IF NOT EXISTS [Group] (groupId integer primary key autoincrement , name text, description text, numMembers integer, code integer)";
configuration.sql.userGroup="CREATE TABLE IF NOT EXISTS UserGroup (userId integer, groupId integer, PRIMARY KEY(userId,groupId), FOREIGN KEY (userId) REFERENCES User(userId), FOREIGN KEY (groupId) REFERENCES [Group](groupId))";



