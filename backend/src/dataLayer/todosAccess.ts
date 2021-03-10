import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import { UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import TodoStorageLayer from '../dataLayer/todosStore';
import { APIGatewayProxyEvent } from 'aws-lambda';

const XAWS = AWSXRay.captureAWS(AWS)
const todoStorageLayer = new TodoStorageLayer();

export class TodosAccess {
  
  constructor(
    private readonly docClient:DocumentClient = createDynamodbClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.INDEX_NAME,
    private readonly logger = createLogger('todo')){
  }

  async getAllTodos(subject): Promise<TodoItem[]> {
    this.logger.info('getAllTodos: ')
    const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName: this.indexName,
      KeyConditionExpression: "jwtsub = :subject",
      ExpressionAttributeValues: {
        ":subject": subject
      },
      ScanIndexForward: false
    }).promise()
  const items = result.Items
  return items as TodoItem[]
  }

  async updateTodo(todoId, updatedTodo:UpdateTodoRequest): Promise<UpdateItemOutput[]>{
    this.logger.info('updateTodo: ')
    const result = await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        "todoId": todoId
      },
      UpdateExpression: "set #name=:name, #dueDate=:dueDate, #done=:done",
      ExpressionAttributeNames:{
        "#name": "name",
        "#dueDate": "dueDate",
        "#done": "done"
      },
      ExpressionAttributeValues:{
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done
      },
      ReturnValues:"UPDATED_NEW"
      }).promise()

    return result as unknown as UpdateItemOutput[]
  }

  async createTodo(newItem): Promise<void> {
    this.logger.info('createTodo: ')
    await this.docClient.put({
      TableName: this.todoTable,
      Item: newItem,
    }).promise()
  }

  async deleteTodo(todoId): Promise<DeleteItemOutput> {
    this.logger.info('createTodo: ')
    const result = await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        todoId: todoId
      }
    }).promise()

    return result
  }
}

function createDynamodbClient(){
  if(process.env.IS_OFFLINE){
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }
  return new XAWS.DynamoDB.DocumentClient()
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
  const bucket = todoStorageLayer.getBucketName();
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
  const todoId = event.pathParameters.todoId;

  const createSignedUrlRequest = {
    Bucket: bucket,
    Key: todoId,
    Expires: urlExpiration
  }

  return todoStorageLayer.getPresignedUploadURL(createSignedUrlRequest);
}

