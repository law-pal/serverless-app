import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';

const todoItemAccess = new TodosAccess()

export async function getAllTodos(subject): Promise<TodoItem[]>{
    return todoItemAccess.getAllTodos(subject); 
}

export async function updateTodo(todoId, updatedTodo:UpdateTodoRequest): Promise<UpdateItemOutput[]>{
    return todoItemAccess.updateTodo(todoId, updatedTodo); 
}

export async function createTodo(newItem): Promise<void>{
    return todoItemAccess.createTodo(newItem); 
}

export async function deleteTodo(todoId): Promise<DeleteItemOutput>{
    return todoItemAccess.deleteTodo(todoId); 
}

