import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high';
export type Category = string;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
  category: Category;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  getTodosByCategory: (category: Category) => Todo[];
  getOverdueTodos: () => Todo[];
  getCompletionRate: () => number;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        })),
      getTodosByCategory: (category) => {
        return get().todos.filter((todo) => todo.category === category);
      },
      getOverdueTodos: () => {
        const now = new Date();
        return get().todos.filter(
          (todo) => todo.dueDate && new Date(todo.dueDate) < now && !todo.completed
        );
      },
      getCompletionRate: () => {
        const todos = get().todos;
        if (todos.length === 0) return 100;
        const completedTodos = todos.filter((todo) => todo.completed).length;
        return Math.round((completedTodos / todos.length) * 100);
      },
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        todos: state.todos.map(todo => ({
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.todos = state.todos.map(todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
          }));
        }
      }
    }
  )
);