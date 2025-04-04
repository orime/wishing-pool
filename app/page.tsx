'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Sparkles, Edit, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/utils/supabase/useUser';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  editing?: boolean;
  creator_email?: string;
};

export default function Home() {
  const supabase = createClient();
  const { user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('todos_with_profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error) setTodos(data || []);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodos(); // 无论是否登录都获取数据

    // 设置realtime订阅
    const channel = supabase
      .channel('todos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos'
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              // 获取新创建的todo的完整数据
              supabase
                .from('todos_with_profiles')
                .select('*')
                .eq('id', payload.new.id)
                .single()
                .then(({ data }) => {
                  if (data) {
                    setTodos(prev => [data, ...prev]);
                  }
                });
              break;
            case 'UPDATE':
              setTodos(prev =>
                prev.map(todo =>
                  todo.id === payload.new.id ? { ...todo, ...payload.new } : todo
                )
              );
              break;
            case 'DELETE':
              setTodos(prev => prev.filter(todo => todo.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          text: newTodo.trim(), 
          completed: false,
          user_id: user.id,
          profile_id: user.id,
        }])
        .select();
      
      if (error) throw error;
      
      if (data?.[0]) {
        setTodos([data[0], ...todos]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || !user) return;
    
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id: number, newText: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('todos')
        .update({ text: newText })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-8 w-8 text-purple-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Orime的许愿池</h1>
          </div>

          {user && (
            <form onSubmit={addTodo} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="添加新愿望..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                >
                  <Plus className="h-5 w-5" />
                  添加
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3 max-h-[calc(100vh-18rem)] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>加载中...</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        todo.completed ? 'bg-green-50' : 'bg-white'
                      } shadow-sm border border-gray-100 group hover:shadow-md transition-shadow duration-200`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
                        >
                          {todo.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6" />
                          )}
                        </button>
                        {todo.editing ? (
                          <input
                            type="text"
                            defaultValue={todo.text}
                            onBlur={(e) => {
                              const newText = e.target.value.trim();
                              if (newText && newText !== todo.text) {
                                updateTodo(todo.id, newText);
                                setTodos(todos.map(t => 
                                  t.id === todo.id ? {...t, text: newText, editing: false} : t
                                ));
                              } else {
                                setTodos(todos.map(t => 
                                  t.id === todo.id ? {...t, editing: false} : t
                                ));
                              }
                            }}
                            className="px-2 py-1 border rounded"
                            autoFocus
                          />
                        ) : (
                          <span className={`${
                            todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                          }`}>
                            {todo.text}
                          </span>
                        )}
                      </div>
                      <div className="min-w-[60px] flex items-center mr-2 gap-1">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                          {todo.creator_email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">
                          {user?.id === todo.user_id ? (
                            <span className="ml-1 bg-purple-100 text-purple-800 px-1 rounded text-xs">
                              我的
                            </span>
                          ) : todo.creator_email}
                        </span>
                      </div>
                      {user?.id === todo.user_id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTodos(todos.map(t => 
                              t.id === todo.id ? {...t, editing: !t.editing} : t
                            ))}
                            className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-500 transition-all duration-200"
                          >
                            {todo.editing ? (
                              <Save className="h-5 w-5" />
                            ) : (
                              <Edit className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {todos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>{user ? '还没有愿望哦，快来添加第一个吧！✨' : '暂时没有愿望清单'}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
