import React, { useState, useEffect } from 'react';


const API_URL = 'http://localhost:3000';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  
  //(GET)
  
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
  }, []);

  
  //(POST)
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    const newTask = {
      nome: newTaskName,
      done: false
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

      
      const createdTask = await response.json(); 

      
      setTasks([...tasks, createdTask]);
      setNewTaskName('');

    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  
  //(PUT)
  
  const handleToggleDone = async (id, currentDoneStatus) => {
    try {
      const response = await fetch(`${API_URL}/task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDoneStatus })
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar tarefa');
      }

      const data = await response.json();
      const updatedTask = data.produto;

      
      setTasks(tasks.map(task => 
        task._id === id ? updatedTask : task
      ));

    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  
  //(DELETE)
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/task/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar tarefa');
      }
      
      
      setTasks(tasks.filter(task => task._id !== id));

    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // RENDERIZAÇÃO DO COMPONENTE (JSX)
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