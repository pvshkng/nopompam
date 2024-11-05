"use server"

import sqlQuery from './config';

const catalog = process.env.DATABRICKS_CATALOG
const schema = process.env.DATABRICKS_SCHEMA
const table = process.env.DATABRICKS_TABLE

export default async function insertFeedback(props: {feedbackId: string, user: string, messageId: string, message: string, feedbackType: string, comment: string, timeStamp: string}){
  const {feedbackId, user, messageId, message, feedbackType, comment, timeStamp} = props
  const query = `INSERT INTO ${catalog}.${schema}.${table} VALUES ('${feedbackId}', '${user}', '${messageId}', '${addslashes(message)}', '${feedbackType}', '${addslashes(comment)}', '${timeStamp}');`
  await sqlQuery(query);
}
