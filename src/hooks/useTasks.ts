import { useLocalStorage } from './useLocalStorage';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('dashboard-tasks', []);

  const addTask = (title: string, priority: Task['priority'] = 'medium', dueDate?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      dueDate,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearCompleted,
  };
}
