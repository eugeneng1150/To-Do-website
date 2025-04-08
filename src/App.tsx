import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Circle,
  XCircle,
  Calendar,
  Flag,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useTodoStore, Priority, Category } from './store';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

const priorityColors = {
  low: 'text-blue-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

const categoryColors: { [key: string]: string } = {
  personal: 'bg-purple-100 text-purple-800',
  work: 'bg-blue-100 text-blue-800',
  shopping: 'bg-green-100 text-green-800',
  health: 'bg-red-100 text-red-800',
};

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<string | 'all'>('all');

  const {
    todos,
    categories,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getOverdueTodos,
    getCompletionRate,
  } = useTodoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo({
        text: newTodo.trim(),
        completed: false,
        priority: selectedPriority,
        category: selectedCategory.trim() || 'uncategorized',
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setNewTodo('');
      setDueDate('');
    }
  };

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(todo => todo.category === filter);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const overdueTodos = getOverdueTodos();
  const completionRate = getCompletionRate();
  const uniqueCategories = Array.from(new Set(todos.map(todo => todo.category)));

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    
    const hash = category.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Todo Tracker</h1>
          </div>

          {/* Completion Progress Bar */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Completion Progress</span>
              <span className="text-sm font-medium text-gray-700">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${completionRate}%`,
                  backgroundColor: completionRate === 100 ? '#22c55e' : '#6366f1'
                }}
              ></div>
            </div>
          </div>

          {/* Add Todo Form */}
          <form onSubmit={handleSubmit} className="p-6 border-b space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={20} />
                <span>Add</span>
              </button>
            </div>

            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-gray-500" />
                <input
                  type="text"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  placeholder="Add category"
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Flag size={16} className="text-gray-500" />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  className="border rounded px-2 py-1"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
          </form>

          {/* Category Filter */}
          <div className="px-6 py-3 bg-gray-50 border-b flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              All
            </button>
            {uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === category
                    ? getCategoryColor(category)
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Overdue Todos Warning */}
          {overdueTodos.length > 0 && (
            <div className="px-6 py-3 bg-red-50 border-b flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span>{overdueTodos.length} overdue {overdueTodos.length === 1 ? 'task' : 'tasks'}</span>
            </div>
          )}

          {/* Todo List */}
          <div className="divide-y">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`text-2xl ${
                    todo.completed ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {todo.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                <div className="flex-1 space-y-1">
                  <span
                    className={`block ${
                      todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex gap-2 text-sm">
                    <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(todo.category)}`}>
                      {todo.category}
                    </span>
                    <span className={`${priorityColors[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className={`flex items-center gap-1 ${
                        new Date(todo.dueDate) < new Date() && !todo.completed
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}>
                        <Calendar size={14} />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
            <span>{activeTodos} items left</span>
            {hasCompletedTodos && (
              <button
                onClick={clearCompleted}
                className="flex items-center gap-1 text-red-500 hover:text-red-700"
              >
                <XCircle size={16} />
                <span>Clear completed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;