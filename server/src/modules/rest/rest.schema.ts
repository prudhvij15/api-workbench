//valid RESY request 
import {z} from 'zod';



export const restExecuteSchema = z.object({
    method : z.string().min(1),
    url : z.string().url(),
    headers : z.record(z.string(),z.string()).optional(),
    body : z.any().optional()
})

export type RestExecuteInput = z.infer<typeof restExecuteSchema>