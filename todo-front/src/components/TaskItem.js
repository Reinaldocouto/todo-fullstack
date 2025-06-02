// src/components/TaskItem.js
import React from "react";

// Converte texto “Em Progresso” → “em-progresso” para classes
const toClass = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function TaskItem({ tarefa, onEdit, onRequestDelete }) {
  const statusClass = `status-${toClass(tarefa.status)}`;

  // formata data/hora
  const dt = new Date(tarefa.datacriacao);
  const dataFormatada = dt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaFormatada = dt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className={`task-card ${statusClass}`}>
      <div className="task-details">
        <strong>{tarefa.titulo}</strong> — <em>{tarefa.status}</em>
        <p>{tarefa.descricao}</p>
        <small className="task-date">
          Criada em: {dataFormatada} às {horaFormatada}
        </small>
      </div>
      <div className="task-actions">
        <button className="secondary" onClick={() => onEdit(tarefa)}>
          Editar
        </button>
        <button
          className="secondary"
          onClick={() => onRequestDelete(tarefa)}
          style={{ marginLeft: 8 }}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
