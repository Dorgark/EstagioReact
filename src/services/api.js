const API_URL = 'https://todolistbackend-seven.vercel.app';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erro na requisição');
  }
  
  if (response.status === 204) return null; 
  return response.json();
};

// --- MÉTODOS DA API ---

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return handleResponse(response);
};

export const createTask = async (name) => {
  const response = await fetch(`${API_URL}/task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, done: false }), 
  });
  return handleResponse(response);
};

export const updateTask = async (id, updates) =>{
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updates),
  })
  return handleResponse(response)
}

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};