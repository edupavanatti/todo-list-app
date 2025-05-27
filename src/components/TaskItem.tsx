import { IonItem, IonLabel, IonButton, IonInput, IonCheckbox, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useState } from 'react';
import { Task } from '../types';

interface Props {
    task: Task;
    onUpdate: (id: number, updated: Partial<Task>) => void;
    onDelete: (id: number) => void;
    onError: (message: string) => void;
}

const TaskItem: React.FC<Props> = ({ task, onUpdate, onDelete, onError }) => {
    // Estado local para controlar a edição da tarefa.
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);

    return (
        <IonItem>
            {/* Checkbox para marcar a task como concluída. */}
            <IonCheckbox
                checked={task.completed}
                onIonChange={async event => {
                    try {
                        onUpdate(task.id, { completed: event.detail.checked });
                    } catch {
                        onError('Erro ao atualizar status da tarefa.');
                    }
                }}
                slot="start"
            />

            {/* Grid para alinhar os componentes da task. */}
            <IonGrid>
                <IonRow className="ion-align-items-center">
                    <IonCol size="8">
                        {isEditing ? (
                            // Modo edição: campo de entrada.
                            <IonInput
                                value={editedTitle}
                                onIonChange={(event) => setEditedTitle(event.detail.value ?? '')}
                            />
                        ) : (
                            // Modo visualização: título.
                            <IonLabel style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.title}
                            </IonLabel>
                        )}
                    </IonCol>

                    {/* Botões para editar (ou salvar a alteração em caso de edição) e remover a tarefa. */}
                    <IonCol size="4" className="ion-text-right">
                        {isEditing ? (
                            <IonButton
                                size="small"
                                onClick={async () => {
                                    if (!editedTitle.trim()) {
                                        // Avisa o usuário caso tente editar uma tarefa com o título em branco.
                                        onError('O título não pode estar vazio.');
                                        return;
                                    }

                                    try {
                                        onUpdate(task.id, { title: editedTitle });
                                        setIsEditing(false);
                                    } catch {
                                        onError('Erro ao salvar tarefa.');
                                    }
                                }}
                            >
                                Salvar
                            </IonButton>
                        ) : (
                            <IonButton size="small" onClick={() => setIsEditing(true)}>Editar</IonButton>
                        )}
                        <IonButton
                            color="danger"
                            size="small"
                            onClick={async () => {
                                try {
                                    onDelete(task.id);
                                } catch {
                                    onError('Erro ao remover tarefa.');
                                }
                            }}
                        >
                            Remover
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonItem>
    );
};

export default TaskItem;