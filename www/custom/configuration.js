/**
 * Created by luisandresgurmendez on 15/9/17.
 */

var configuration={};
configuration.sql={};
configuration.host="10.252.253.28"
configuration.port="3000"
configuration.sql.user="CREATE TABLE IF NOT EXISTS User (userId integer primary key autoincrement, username text, house text,userIdInServer text unique)";
configuration.sql.prediction="CREATE TABLE IF NOT EXISTS Prediction (predictionId integer primary key autoincrement, character text, status text, killedBy text, chapter integer, userId integer, FOREIGN KEY (userId) REFERENCES User(userId))";
// Group es una palabra reservada de SQL de "Group By" hay que poner entra []
configuration.sql.group="CREATE TABLE IF NOT EXISTS [Group] (groupId integer primary key autoincrement , groupIdInServer text unique,name text, description text, numMembers integer, code text)";
configuration.sql.userGroup="CREATE TABLE IF NOT EXISTS UserGroup (userId text, groupId text, userIdInServer text,groupIdInServer text,  PRIMARY KEY(userId,groupId), FOREIGN KEY (userId) REFERENCES User(userId), FOREIGN KEY (groupId) REFERENCES [Group](groupId))";



