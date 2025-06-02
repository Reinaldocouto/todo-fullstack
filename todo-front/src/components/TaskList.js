// src/components/TaskList.js
import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tarefas, onEdit, onDelete }) {
  if (tarefas.length === 0) {
    return <p>Sem tarefas cadastradas.</p>;
  }

  return (
    <ul className="task-list">
      {tarefas.map((t) => (
        <TaskItem
          key={t.id}
          tarefa={t}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
