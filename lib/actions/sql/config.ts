"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getEntraIdToken } from "@/lib/actions/auth/getToken";

export default async function sqlQuery(query: string) {
  //const session: any = await getServerSession(authOptions);
  //const token = session?.user?.accessToken || "";
  const token = await getEntraIdToken();
  const baseUrl = process.env.DATABRICKS_SERVER_HOSTNAME;
  const url = `https://${baseUrl}/api/2.0/sql/statements/`;
  const warehouse_id = process.env.DATABRICKS_WAREHOUSE_ID;
  const wait_timeout = "50s";

  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = {
    warehouse_id: warehouse_id,
    statement: query,
    wait_timeout: wait_timeout,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  async function executeQuery() {
    const response = await fetch(url, options);
    return await response.json();
  }

  try {
    let result = await executeQuery();
    if (result.status && result.status.state === "PENDING") {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      result = await executeQuery();
    }
    console.log("SQL query result", result);
    return result;
  } catch (error) {
    console.error("Error while executing SQL query: ", error);
    return undefined;
  }
}
