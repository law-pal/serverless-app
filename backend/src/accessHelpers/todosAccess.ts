import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

const XAWS = AWSXRay.captureAWS(AWS)

export default class TodosAccess {
  
  constructor(
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.INDEX_NAME,
    private readonly documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
  ) { }
  
  // gets all todos
  async getAllTodos(userId) {
    const result = await this.documentClient.query({
      TableName: this.todosTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    return result.Items;
  }


  // updates a todo
  async updateTodo(todoId, userId, updatedTodo) {
    await this.documentClient.update({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
      ExpressionAttributeValues: {
        ':n': updatedTodo.name,
        ':due': updatedTodo.dueDate,
        ':d': updatedTodo.done
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      }
    }).promise();
  }


  // deletes a todo
  async deleteTodo(todoId, userId) {
    await this.documentClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      }
    }).promise();
  }


  // get a todo
  async getTodo(todoId, userId) {
    const result = await this.documentClient.get({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      }
    }).promise();

    return result.Item;
  }


  // creates a new todo
  async addTodo(todoItem) {
    await this.documentClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise();
  }
  
}

