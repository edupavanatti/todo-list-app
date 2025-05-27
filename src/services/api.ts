import {Task} from "../types";

const API_URL = '/api/tasks';

// Retorna todas as tarefas (GET).
export async function getTasks() {
    const res = await fetch(API_URL);
    return res.json();
}

// Cria uma nova tarefa (POST).
export async function addTask(task: { title: string }) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: false })
    });
    return res.json();
}

// Atualiza parcialmente uma tarefa (PATCH).
export async function updateTask(id: number, updated: Partial<Task>) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    });
    return res.json();
}

// Deleta uma tarefa pelo ID (DELETE).
export async function deleteTask(id: number) {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
}