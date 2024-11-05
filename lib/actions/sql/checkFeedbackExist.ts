"use server"

import sqlQuery from './config';

const catalog = process.env.DATABRICKS_CATALOG
const schema = process.env.DATABRICKS_SCHEMA
const table = process.env.DATABRICKS_TABLE

export default async function checkFeedbackExist(messageId: string){
    const query = `SELECT * FROM ${catalog}.${schema}.${table} WHERE MESSAGE_ID == '${messageId}'`
    const returnResult = await sqlQuery(query);
    return returnResult
}
