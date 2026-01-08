import { useState } from 'react';
import { X, Plus, Check, Trash2, Circle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useTasks, Task } from '@/hooks/useTasks';

interface TasksWidgetProps {
  onRemove: () => void;
}

export const TasksWidget = ({ onRemove }: TasksWidgetProps) => {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskPriority);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;

  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-warning',
    high: 'text-destructive',
  };

  const priorityIcons = {
    low: <Circle size={12} />,
    medium: <Clock size={12} />,
    high: <AlertCircle size={12} />,
  };

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title">Tasks</span>
        <div className="flex gap-2">
          {completedCount > 0 && (
            <button 
              onClick={clearCompleted}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear done
            </button>
          )}
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="widget-content h-[calc(100%-52px)] flex flex-col">
        {/* Add Task Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-1 bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
            className="bg-secondary border border-border rounded px-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Med</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={handleAddTask}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-3">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && ` (${tasks.length})`}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-auto scrollbar-thin space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks`}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 bg-secondary/30 rounded border border-border/50 hover:border-primary/30 transition-all ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`transition-colors ${task.completed ? 'text-success' : 'text-muted-foreground hover:text-primary'}`}
                >
                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                </div>
                <span className={`flex items-center gap-1 text-xs ${priorityColors[task.priority]}`}>
                  {priorityIcons[task.priority]}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
