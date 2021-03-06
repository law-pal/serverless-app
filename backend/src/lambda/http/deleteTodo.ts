import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { deleteTodo } from '../../distribution/todosDistributions';
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`Processing event ${JSON.stringify(event)}`)
  if (!(await deleteTodo(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }
  
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}

