"use server";
import * as mg from "./config";

export default async function queryTemplates() {
  try {
    const collection = await mg.getCollection("kchat", "templates");
    const result = await collection
      .find(
        {},
        {
          projection: { _id: { $toString: "$_id" }, prompt: 1, usecase: 1 },
        }
      )
      .toArray();
    //console.log("Templates: ", result);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  } 
}
