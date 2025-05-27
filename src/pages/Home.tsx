import {IonContent, IonPage, IonInput, IonButton, IonList, IonToast } from '@ionic/react';
import { useState, useEffect } from 'react';
import { Task } from '../types';
import TaskItem from '../components/TaskItem';
import { getTasks, addTask, updateTask, deleteTask } from '../services/api';

const Home: React.FC = () => {
    // Estado local para armazenar todas as tarefas.
    const [tasks, setTasks] = useState<Task[]>([]);

    // Campo de entrada para novas tarefas.
    const [newTask, setNewTask] = useState('');

    // Filtro de exibição: all (todas) | completed (concluídas) | pending (pendentes)
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

    // Componentes relacionados ao tratamento de erros.
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Carrega as tarefas da API ao iniciar a aplicação.
    useEffect(() => {
        fetchTasks();
    }, []);

    // Função para buscar as tarefas da API mockada.
    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch {
            handleError('Erro ao carregar tarefas.');
        }
    };

    // Aplica o filtro de visualização.
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    // Adiciona uma nova tarefa via POST.
    const handleAdd = async () => {
        if (!newTask.trim()) {
            // Avisa o usuário caso tente adicionar uma tarefa em branco.
            handleError('O título da tarefa não pode estar vazio.');
            return;
        }

        try {
            await addTask({ title: newTask });
            setNewTask('');
            fetchTasks();
        } catch {
            handleError('Erro ao adicionar tarefa.');
        }
    };

    // Função auxiliar para exibir mensagens de erro.
    const handleError = (message: string) => {
        // Fecha o toast aberto (se houver) antes de exibir o próximo.
        setShowToast(false);
        setTimeout(() => {
            setError(message);
            setShowToast(true);
        }, 50);
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                {/* Campo de entrada para adicionar uma nova tarefa. */}
                <IonInput
                    value={newTask}
                    placeholder="Digite uma nova tarefa..."
                    onIonChange={(event) => setNewTask(event.detail.value ?? '')}
                />

                {/* Botão para adicionar uma nova tarefa. */}
                <IonButton expand="block" onClick={handleAdd}>Adicionar</IonButton>

                {/* Botões para filtrar as tarefas. */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px'}}>
                    <IonButton onClick={() => setFilter('all')}
                               color={filter === 'all' ? 'primary' : 'medium'}>Todas</IonButton>
                    <IonButton onClick={() => setFilter('completed')}
                               color={filter === 'completed' ? 'primary' : 'medium'}>Concluídas</IonButton>
                    <IonButton onClick={() => setFilter('pending')}
                               color={filter === 'pending' ? 'primary' : 'medium'}>Pendentes</IonButton>
                </div>

                {/* Lista de tarefas filtradas. */}
                <IonList>
                    {filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={async (id, data) => {
                                // Callback para quando uma task é editada.
                                await updateTask(id, data);
                                fetchTasks();
                            }}
                            onDelete={async id => {
                                // Callback para quando uma task é removida.
                                await deleteTask(id);
                                fetchTasks();
                            }}
                            onError={handleError}
                        />
                    ))}
                </IonList>
            </IonContent>
            {/* Toast a ser exibido em caso de erros. */}
            <IonToast
                isOpen={showToast}
                message={error}
                duration={3000}
                style={{ textAlign: 'center' }}
                color="danger"
            />
        </IonPage>
    );
};

export default Home;