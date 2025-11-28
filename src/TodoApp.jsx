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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      const createdTask = await createTask(newTaskName);
      setTasks([...tasks, createdTask]);
      setNewTaskName('');
      setError(null);
    } catch (err) {
      alert(err.message);
    }
  };

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

  const handleToggleDone = async (task) => {
    try {
      const updatedTask = await updateTask(task._id, {done: !task.done});
    
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
    } catch (err) {
      console.error("Erro ao atualizar", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Erro ao deletar", err);
    }
  };

  return (
    <div class="mainDiv">
      <div class="sideDiv">
        <form onSubmit={handleAddTask}>
          <h1>Lista de Tarefas</h1>
          <input 
            type="text" 
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Digite uma nova tarefa..."
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>

      <ul> 
        {tasks.map(task => (
          <li 
            key={task._id} 
          >
            <span 
              onClick={() => handleToggleDone(task)} 
              style={{ 
                textDecoration: task.done ? 'line-through' : 'none',
                color: task.done ? '#949494ff' : '#f5f5f5ff'
              }}
            >{task.name}</span>
            
            <button onClick={() => handleEdit(task)}>✏️</button>
            
            <button onClick={() => handleDelete(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;