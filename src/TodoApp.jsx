import React, { useState, useEffect } from 'react';

// URL da sua API
const API_URL = 'http://localhost:3000';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState(''); // Estado para o input]
  // Guarda o ID da tarefa que está sendo editada
  const [editingTaskId, setEditingTaskId] = useState(null); 
  // Guarda o texto do input de edição
  const [editingTaskName, setEditingTaskName] = useState('');

  // -----------------------------------------------------------------
  // 1. (GET) BUSCAR TAREFAS QUANDO O COMPONENTE CARREGA
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };
    
    fetchTasks();
  }, []); // [] = Rodar apenas uma vez

  // -----------------------------------------------------------------
  // 2. (POST) ADICIONAR NOVA TAREFA
  // -----------------------------------------------------------------
  const handleAddTask = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página do formulário
    if (!newTaskName.trim()) return; // Não adiciona se estiver vazio

    const newTask = {
      nome: newTaskName,
      done: false // Tarefas novas sempre começam como "não feitas"
    };

    try {
      const response = await fetch(`${API_URL}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error('Falha ao criar tarefa');
      }

      // IMPORTANTE: Assumindo que seu back-end retorna a tarefa criada
      // Veja a observação abaixo!
      const createdTask = await response.json(); 

      // Adiciona a nova tarefa à lista no estado do React
      setTasks([...tasks, createdTask]);
      setNewTaskName(''); // Limpa o campo de input

    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  // -----------------------------------------------------------------
  // 3. (PUT) ATUALIZAR STATUS DA TAREFA (MARCAR COMO FEITA)
  // -----------------------------------------------------------------
  const handleToggleDone = async (id, currentDoneStatus) => {
    try {
      const response = await fetch(`${API_URL}/task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDoneStatus }) // Envia o status invertido
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar tarefa');
      }

      const data = await response.json();
      const updatedTask = data.produto; // 'produto' foi como você chamou no seu back-end

      // Atualiza a lista no estado
      setTasks(tasks.map(task => 
        task._id === id ? updatedTask : task
      ));

    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  // -----------------------------------------------------------------
  // 4. (DELETE) EXCLUIR TAREFA
  // -----------------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/task/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar tarefa');
      }
      
      // Remove a tarefa da lista no estado
      setTasks(tasks.filter(task => task._id !== id));

    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // -----------------------------------------------------------------
  // RENDERIZAÇÃO DO COMPONENTE (JSX)
  // -----------------------------------------------------------------
  return (
    <div>
      <h1>Lista de Tarefas (CRUD Completo)</h1>

      {/* Formulário de Criação (POST) */}
      <form onSubmit={handleAddTask}>
        <input 
          type="text" 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Digite uma nova tarefa..."
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Lista de Tarefas (GET, PUT, DELETE) */}
      <ul>
        {tasks.map(task => (
          <li 
            key={task._id} 
            style={{ 
              textDecoration: task.done ? 'line-through' : 'none',
              margin: '10px 0'
            }}
          >
            {/* Nome da Tarefa */}
            <span onClick={() => handleToggleDone(task._id, task.done)} style={{ cursor: 'pointer' }}>
              {task.nome}
            </span>
            
            {/* Botão de Toggle (PUT) */}
            <button 
              onClick={() => handleToggleDone(task._id, task.done)} 
              style={{ margin: '0 5px' }}
            >
              {task.done ? 'Desfazer' : 'Concluir'}
            </button>
            
            {/* Botão de Excluir (DELETE) */}
            <button onClick={() => handleDelete(task._id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;