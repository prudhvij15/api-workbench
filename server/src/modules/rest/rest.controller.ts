import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { restExecuteSchema } from './rest.schema';
import { executeRestService } from './rest.service';




export async function executeRest(request : FastifyRequest , reply : FastifyReply) {
    
    const parsed = restExecuteSchema.safeParse(request.body);

    if(!parsed.success){
        reply.code(400);
        return {
            error : "invalid request",
            details : parsed.error.issues
        }
    }
 const result = await executeRestService(parsed.data)
  return result;    
}