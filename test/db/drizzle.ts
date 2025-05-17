// @ts-ignore
const path = require('path');
// @ts-ignore
const dotenv = require('dotenv');
const { neon } = require('@neondatabase/serverless')
const { drizzle } = require('drizzle-orm/neon-http')
const { eq } = require("drizzle-orm");
const { pgSchema, pgTable, serial, text, integer, varchar, jsonb, timestamp } = require('drizzle-orm/pg-core');


const chatai_chat = pgSchema('chatai_chat');
const chat_messages = chatai_chat.table('chat_messages', {
    id: varchar('id').primaryKey(),
    title: text('title'),
    messages: jsonb('messages'),
    user: text('user'),
    created_on: timestamp('created_on', { mode: 'date' }).defaultNow(),
    updated_on: timestamp('updated_on', { mode: 'date' }).defaultNow(),

});
dotenv.config({
    path: path.resolve(__dirname, '../../.env.local')
});



async function main() {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle({ client: sql });

    const result = await db.select().from(chat_messages).where(eq(chat_messages.user, "p.kungsapattarakul@gmail.com"));
    console.log(result[0]);

}

main()