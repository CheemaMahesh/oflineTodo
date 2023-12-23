import React, { useEffect, useState } from "react";
import './Todo.css';

const Todo = () => {
    // State to manage todos and the new todo input
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    // Load todos from local storage when the component mounts
    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('store'));
        if (Array.isArray(localData)) {
            // Sort todos based on completion and time before setting them in state
            const sortedTodos = localData.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return new Date(b.time) - new Date(a.time);
            });
            setTodos(sortedTodos);
        }
    }, []);

    // Function to add a new todo
    const handleAdd = () => {
        if (newTodo.trim() !== '') {
            const addableTodo = {
                name: newTodo,
                completed: false,
                time: new Date().toISOString()
            };

            const updatedTodos = [addableTodo, ...todos];
            setTodos(updatedTodos);

            localStorage.setItem('store', JSON.stringify(updatedTodos));

            setNewTodo('');
        }
    }

    // Function to mark a todo as completed
    const handleComplete = (index) => {
        const updatedTodos = [...todos];
        const completedTodo = updatedTodos.splice(index, 1)[0];
        completedTodo.completed = true;
        updatedTodos.push(completedTodo);

        localStorage.setItem('store', JSON.stringify(updatedTodos));
        
        setTodos(updatedTodos);
    }

    // Function to reset todos to initial state
    const handleReset = () => {
        localStorage.removeItem('store');
        setTodos([]);
    }

    return (
        <div className="todo">
            {/* Header section with Reset button */}
            <div className="header">
                <button className="reset-button" onClick={handleReset}>Reset</button>
            </div>

            {/* Input section to add new todos */}
            <div className="input-div">
                <input
                    placeholder="Add todo"
                    className="input"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAdd();
                    }}
                />
                <button className="button" onClick={handleAdd}>Add todo</button>
            </div>

            {/* Todo list section */}
            <div className="todo-list">
                <ul className="ul-list">
                    {todos && todos.map((data, i) => (
                        <li className={`list ${data.completed ? 'completed' : ''}`} key={i} onClick={() => handleComplete(i)}>
                            <span>{data.name}</span>&emsp;
                            {/* Button to indicate completed or incomplete todos */}
                            {data.completed ? (
                                <button className="completed-button">Completed</button>
                            ) : (
                                <button className="incomplete-button">Incomplete</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Todo;
