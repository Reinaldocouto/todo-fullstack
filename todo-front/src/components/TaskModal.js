// src/components/TaskModal.js
import React, { useState, useEffect } from "react";

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("Pendente");

  // Quando `initialData` mudar (ou o modal abrir), preencha os campos
  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setDescricao(initialData.descricao);
      setStatus(initialData.status);
    } else {
      setTitulo("");
      setDescricao("");
      setStatus("Pendente");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      id: initialData?.id, 
      titulo, 
      descricao, 
      status 
    });
    // limpar só se foi criar, no caso de editar, quem fecha é o App
    if (!initialData) {
      setTitulo("");
      setDescricao("");
      setStatus("Pendente");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{initialData ? "Editar Tarefa" : "Nova Tarefa"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              Título
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </label>
            <label>
              Descrição
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </label>
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pendente">Pendente</option>
                <option value="Concluída">Concluída</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Aguardando">Aguardando</option>
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="primary">
              {initialData ? "Salvar Alterações" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
