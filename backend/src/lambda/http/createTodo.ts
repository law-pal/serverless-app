import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../distribution/todosDistributions'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodos: CreateTodoRequest = JSON.parse(event.body);

  if (!newTodos.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name not found'
      })
    };
  }

  const items = await createTodo(event, newTodos);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: items
    })
  };
}





