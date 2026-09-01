import { useTodos, Todo } from '../hooks/useTodos';

export default function Dashboard() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
            />
            {todo.title}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}