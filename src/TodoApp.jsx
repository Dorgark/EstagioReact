import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import './TodoApp.css'
function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as tarefas.");
    }
  };

  // ADICIONAR
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      const createdTask = await createTask(newTaskName);
      setTasks([...tasks, createdTask]); // Adiciona na lista visualmente
      setNewTaskName('');
      setError(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // EDITAR NOME
  const handleEdit = async (task) => {
    const newName = prompt("Novo nome da tarefa:", task.name);
    if (!newName || newName === task.name) return;

    try {
      const updatedTask = await updateTask(task._id, { name: newName });

      setTasks(tasks.map(t => 
        t._id === task._id ? updatedTask : t
      ));
      
    } catch (err) {
      console.error("Erro ao editar", err);
      alert("Não foi possível editar a tarefa");
    }
  };




  // ATUALIZAR (Toggle Done)
  const handleToggleDone = async (task) => {
    try {
      // Chamamos a API passando o ID e o INVERSO do status atual
      const updatedTask = await updateTask(task._id, {done: !task.done});
      
      // Atualiza apenas a tarefa que mudou no estado
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
    } catch (err) {
      console.error("Erro ao atualizar", err);
    }
  };

  // DELETAR
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      // Remove da lista visualmente
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Erro ao deletar", err);
    }
  };

  return (
    <div class="mainDiv">
      <div class="sideDiv">
        <h1>Lista de Tarefas</h1>
      </div>
      <form onSubmit={handleAddTask}>
        <input 
          type="text" 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Digite uma nova tarefa..."
          style={{ padding: '8px', marginRight: '5px' }}
        />
        <button type="submit" style={{ padding: '8px' }}>Adicionar</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li 
            key={task._id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
              background: '#585858ff',
              padding: '10px'
            }}
          >
            <span 
              onClick={() => handleToggleDone(task)} 
              style={{ 
                flexGrow: 1,
                textDecoration: task.done ? 'line-through' : 'none',
                cursor: 'pointer',
                color: task.done ? '#949494ff' : '#f5f5f5ff'
              }}
            >{task.name}</span>
            
            <button 
              onClick={() => handleEdit(task)} 
              style={{ background: '#bbbbbbff', color: 'white', border: 'none',border: 'none', padding: '5px 10px',margin:'8px', cursor:'pointer' }}
            >
              ✏️
            </button>
            
            <button 
              onClick={() => handleDelete(task._id)}
              style={{ background: '#bbbbbbff', color: 'white', border: 'none', padding: '5px 10px',margin:'8px', cursor:'pointer' }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;