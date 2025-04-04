import { tool as createTool } from 'ai';
import { z } from 'zod';

export const queryBenefits = createTool({
    description: 'Execute this function if you want to query company benefits',
    parameters:
        z.object({}),
    execute: async function ({ }) {
        return {};
    },
});

export const sendDocument = createTool({
    description: 'Execute this function to send a requested document to an employee such as payslip, Tawi 50 (ทวิ 50)',
    parameters:
        z.object({
            documentName: z.string().describe('The name of the document to send to the employee')
        }),
    execute: async function ({ documentName }) {
        return { documentName };
    },
});

export const sendResignationForm = createTool({
    description: 'Execute this function of you want to send a resignation form to an employee',
    parameters:
        z.object({
            lastDay: z.string().describe('The last day of the employee in this format Wed Mar 12 2025 00:00:00 GMT+0700 (Indochina Time). You need to parse the date for the employeee no matter what format they provide. Time will always be 00:00:00 GMT+0700 (Indochina Time).'),
            reason: z.string().describe('The reason for the resignation, parsed from the employee\'s message and rephrase or make it up to sound more professional as detailed as you can. User will edit it later.'),
        }),
    execute: async function ({ lastDay, reason }) {
        return { lastDay, reason };
    },
});


export const sendJobOpeningForm = createTool({
    description: 'Execute this function of you want to create a new job opening',
    parameters:
        z.object({
            roleName: z.string().describe('The name of the role you have been requested to create an opening for. Optional but you may interpret the role name from the request message').optional(),
            description: z.string().describe('Optional but you may interpret the description as detailed as you can from the request message as draft for the user to edit later').optional(),
            qualification: z.string().describe('The qualification for the role. Optional but you may make up the requirements as detailed as you can from the request message as draft for the user to edit later').optional(),
            salaryRange: z.object({
                from: z.number().describe('The start of the salary range for the job opening.').optional(),
                to: z.number().describe('The end of the salary range for the job opening.').optional()
            })
                .describe('The salary range for the job opening.').optional(),
            jobBoardPost: z.object({
                officialWebsite: z.boolean().describe('Whether to post the job opening on the official website').optional(),
                linkedIn: z.boolean().describe('Whether to post the job opening on LinkedIn').optional(),
                glassdoor: z.boolean().describe('Whether to post the job opening on glassdoor').optional(),
                facebook: z.boolean().describe('Whether to post the job opening on facebook').optional(),
            })
        }),
    execute: async function ({ roleName, description, qualification, salaryRange, jobBoardPost }) {
        return { roleName, description, qualification, salaryRange, jobBoardPost };
    },
});



export const tools = {
    queryBenefits,
    sendDocument,
    sendResignationForm,
    sendJobOpeningForm
}