import { tool } from "ai";
import { z } from "zod";
import type { ModelMessage } from 'ai';
import type { DocumentProps } from './types';
import { streamText } from 'ai';
import { storeArtifact } from '@/lib/mongo/artifact-store';
import { artifactWriter } from "@/lib/ai/client";
import { stringifyToolOutputs } from "@/lib/ai/utils";

const kind = 'sql';

const toolDescription = `
## createSql
# The "createSql" tool creates and updates text artifact that render to the user on a space next to the conversation (referred to as the "dossier").
# Use this tool when asked to generate SQL code.
`

const createInstructions = (title: string, additionalInstructions?: string) => {

    const instructions = `
        <instructions>
        Write SQL code about the given topic. 
        SQL can be mock data, or queries to a database.
        Do not include anything other than the code.

        SQL CODE MUST BE VALID and well-formed.

        Prohibitions:
        - DO NOT WRAP THE OUTPUT IN \`\`\`sql \`\`\`
        </instructions>

        <special_instruction>
        If asked for financial performance query, use the following:
        SELECT
            p.portfolio_id,
            p.portfolio_name,
            ac.asset_class                            AS asset_class,
            COUNT(h.holding_id)                       AS number_of_holdings,
            ROUND(SUM(h.quantity * h.current_price), 2) 
                                                    AS current_value,
            ROUND(SUM(h.quantity * h.purchase_price), 2) 
                                                    AS cost_basis,
            ROUND(SUM(h.quantity * h.current_price) - 
                SUM(h.quantity * h.purchase_price), 2) 
                                                    AS unrealized_gain_loss,
            ROUND(((SUM(h.quantity * h.current_price) - 
                    SUM(h.quantity * h.purchase_price)) / 
                    SUM(h.quantity * h.purchase_price)) * 100, 2) 
                                                    AS return_percentage,
            ROUND(SUM(h.quantity * h.current_price) * 100.0 / 
                SUM(SUM(h.quantity * h.current_price)) 
                OVER (PARTITION BY p.portfolio_id), 2) 
                                                    AS portfolio_allocation_pct,
            ac.risk_level                             AS risk_level
        FROM
            Portfolios p
            INNER JOIN Holdings h 
                ON p.portfolio_id = h.portfolio_id
            INNER JOIN AssetClasses ac 
                ON h.asset_class_id = ac.asset_class_id
        WHERE
            p.status = 'ACTIVE'
            AND h.quantity > 0
        GROUP BY
            p.portfolio_id,
            p.portfolio_name,
            ac.asset_class,
            ac.risk_level
        ORDER BY
            p.portfolio_id,
            current_value DESC;
        </special_instruction>

        Now generate this sql code about:
        ${title}

        ${additionalInstructions ?
            `<additional_instructions>
            Here are some additional instructions to follow while generating the code: 
            ${additionalInstructions}
        </additional_instructions>`
            : ''}
        `
    return instructions;
}

export const createSql = ({ threadId, user, getMemory, writer }: DocumentProps) =>
    tool({
        description: toolDescription,
        inputSchema: z.object({
            title: z.string().describe("The title of the SQL code. Infer from the prompt if not provided."),
            additionalInstructions: z.string().optional().describe("Additional instructions from the user to guide the code generation."),
        }),
        execute: async ({ title, additionalInstructions }, { toolCallId }) => {
            const id = toolCallId; // to change to a unique id
            const memory = getMemory();
            const cleanedMessages = stringifyToolOutputs(memory);
            const prompt = [
                ...cleanedMessages,
                {
                    role: 'user',
                    content: createInstructions(title, additionalInstructions),
                },
            ] as ModelMessage[];

            try {
                writer.write({
                    type: 'data-document',
                    data: {
                        id: id,
                        type: 'init',
                        content: { id, title, kind, },
                    },
                });

                writer.write({
                    type: 'data-document',
                    data: {
                        id: id,
                        type: 'start',
                        content: '',
                    },
                });

                let draftContent = '';
                const { fullStream } = streamText({
                    model: artifactWriter,
                    messages: prompt,
                    onFinish: async ({ response }) => {
                        writer.write({
                            type: 'data-document',
                            data: {
                                id: id,
                                type: 'stop',
                                content: '',
                            },
                        });

                        await storeArtifact({
                            artifactId: id,
                            threadId: threadId,
                            user: user,
                            kind: kind,
                            title: title,
                            content: draftContent,
                        });
                    },
                    onError: (error) => {
                        console.error('Error during artifact creation: ', error);
                        writer.write({
                            type: 'data-document',
                            data: {
                                id: id,
                                type: 'error',
                                content: error,
                            },
                        });
                    },
                });

                for await (const delta of fullStream) {
                    const { type } = delta;

                    if (type === 'text-delta') {
                        const { text } = delta;
                        draftContent += text;

                        writer.write({
                            type: 'data-document',
                            data: {
                                id: id,
                                type: 'text',
                                content: text,
                            },
                        });
                    }
                }

                return {
                    id,
                    title,
                    kind,
                    content: draftContent,
                };

            } catch (error) {
                console.error('Error during artifact creation: ', error);
                writer.write({
                    type: 'data-document',
                    data: {
                        id: id,
                        type: 'error',
                        content: error,
                    },
                });
                return error;
            }
        },
    });
