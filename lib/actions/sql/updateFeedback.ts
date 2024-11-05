"use server"

import { addslashes } from '@/lib/utils';
import sqlQuery from './config';

const catalog = process.env.DATABRICKS_CATALOG
const schema = process.env.DATABRICKS_SCHEMA
const table = process.env.DATABRICKS_TABLE

export default async function updateFeedback(props: {feedbackId: string, user: string, messageId: string, message: string, feedbackType: string, comment: string, timeStamp: string}){
  const {feedbackId, user, messageId, message, feedbackType, comment, timeStamp} = props
  const query = `UPDATE ${catalog}.${schema}.${table} SET FEEDBACK_TYPE = "${feedbackType}", COMMENT = "${addslashes(comment)}", TIMESTAMP = "${timeStamp}" WHERE FEEDBACK_ID == "${feedbackId}"`
  await sqlQuery(query);
}
