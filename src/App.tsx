import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Edit3, Trash2, PlusCircle } from "lucide-react"; 
import "./App.css"

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
  });

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoreact");
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("@cursoreact", JSON.stringify(tasks));
  }, [tasks]);

  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Prencha alguma coisa");
      return;
    }
    if (editTask.enabled) {
      handleSaveEdit();
      return;
    }
    setTasks((tarefas) => [...tarefas, input]);
    setInput("");
  }, [input, tasks]);

  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex((task) => task === editTask.task);
    const allTasks = [...tasks];
    allTasks[findIndexTask] = input;
    setTasks(allTasks);
    setEditTask({ enabled: false, task: "" });
    setInput("");
  }

  function handleDelete(item: string) {
    const removeTasks = tasks.filter((task) => task !== item);
    setTasks(removeTasks);
  }

  function handleEdit(item: string) {
    inputRef.current?.focus();
    setInput(item);
    setEditTask({ enabled: true, task: item });
  }

  //Criar nova função que diga o que está fazendo

  const totalTarefas = useMemo(() => tasks.length, [tasks]);

  return (
    <div className="app-container">
      <h1 className="app-title">Lista de Tarefas</h1>
      <div className="input-container">
        <input
          className="task-input"
          placeholder="Digite sua tarefa..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
        />
        <button className="task-button" onClick={handleRegister}>
          {editTask.enabled ? (
            <span>Atualizar</span>
          ) : (
            <>
              <PlusCircle size={18} /> Adicionar
            </>
          )}
        </button>
      </div>
      <p className="task-count">Você tem <strong>{totalTarefas}</strong> tarefas</p>
      <div className="task-list">
        {tasks.map((item, index) => (
          <div key={item} className="task-item">
            <span className="task-text">{item}</span>
            <div className="task-actions">
              <button
                className="edit-button"
                onClick={() => handleEdit(item)}
                title="Editar"
              >
                <Edit3 size={16} />
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(item)}
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
