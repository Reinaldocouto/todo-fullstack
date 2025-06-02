// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import StatusChart from "./components/StatusChart";
import ConfirmModal from "./components/ConfirmMordal";

function App() {
  // ===== Estados principais =====
  const [tarefas, setTarefas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState(null);

  // ===== Estado para modal de confirmação de exclusão =====
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);

  // ===== Estados de filtro =====
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // ===== Carregar tarefas do backend =====
  useEffect(() => {
    axios
      .get("/tarefas")
      .then((res) => setTarefas(res.data))
      .catch((err) => console.error("Erro ao buscar tarefas:", err));
  }, []);

  // ===== Função para criar ou editar tarefa =====
  const salvarTarefa = async ({ id, titulo, descricao, status }) => {
    if (id) {
      // Editar tarefa existente
      try {
        const { data } = await axios.put(`/tarefas/${id}`, {
          titulo,
          descricao,
          status,
        });
        setTarefas((old) => old.map((t) => (t.id === id ? data : t)));
      } catch (err) {
        console.error("Erro ao editar tarefa:", err);
      }
    } else {
      // Criar nova tarefa
      try {
        const { data } = await axios.post("/tarefas", {
          titulo,
          descricao,
          status,
        });
        setTarefas((old) => [...old, data]);
      } catch (err) {
        console.error("Erro ao criar tarefa:", err);
      }
    }
    // Fechar modal e limpar edição
    setModalOpen(false);
    setEditingTarefa(null);
  };

  // ===== Função que realmente exclui a tarefa no backend =====
  const confirmarExclusao = async () => {
    if (!tarefaParaExcluir) return;
    try {
      await axios.delete(`/tarefas/${tarefaParaExcluir.id}`);
      setTarefas((old) =>
        old.filter((t) => t.id !== tarefaParaExcluir.id)
      );
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    } finally {
      setTarefaParaExcluir(null);
    }
  };

  // ===== Função para abrir modal em modo edição =====
  const abrirEdicao = (tarefa) => {
    setEditingTarefa(tarefa);
    setModalOpen(true);
  };

  // ===== Tarefas filtradas segundo texto e/ou status =====
  const tarefasFiltradas = tarefas.filter((t) => {
    // 1) Filtrar por texto (busca em título ou descrição)
    const texto = filtroTexto.toLowerCase();
    const matchTexto =
      t.titulo.toLowerCase().includes(texto) ||
      t.descricao.toLowerCase().includes(texto);

    // 2) Filtrar por status (se filtroStatus vazio, aceita todos)
    const matchStatus = filtroStatus === "" || t.status === filtroStatus;

    return matchTexto && matchStatus;
  });

  return (
    <>
      <header>
        <h1>ToDo List</h1>
      </header>

      <div className="dashboard-container">
        {/* ==== Painel de tarefas ==== */}
        <div className="task-container">
          {/* Botão de criar nova tarefa */}
          <button
            className="primary"
            style={{ marginBottom: "12px" }}
            onClick={() => {
              setEditingTarefa(null);
              setModalOpen(true);
            }}
          >
            + Nova Tarefa
          </button>

          {/* Inputs de filtro */}
          <div
            style={{
              margin: "12px 0",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Buscar por texto..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            >
              <option value="">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Progresso">Em Progresso</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Aguardando">Aguardando</option>
            </select>
          </div>

          {/* Lista de tarefas já filtradas */}
          <TaskList
            tarefas={tarefasFiltradas}
            onEdit={abrirEdicao}
            onRequestDelete={(tarefa) => setTarefaParaExcluir(tarefa)}
          />
        </div>

        {/* ==== Painel do gráfico de status ==== */}
        <div className="chart-container">
          <h2>Status das Tarefas</h2>
          <StatusChart tarefas={tarefas} />
        </div>
      </div>

      {/* ==== Modal de criar/editar tarefa ==== */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTarefa(null);
        }}
        onSubmit={salvarTarefa}
        initialData={editingTarefa}
      />

      {/* ==== ConfirmModal para exclusão ==== */}
      <ConfirmModal
        isOpen={!!tarefaParaExcluir}
        message={
          tarefaParaExcluir
            ? `Tem certeza que deseja excluir "${tarefaParaExcluir.titulo}"?`
            : ""
        }
        onConfirm={confirmarExclusao}
        onCancel={() => setTarefaParaExcluir(null)}
      />
    </>
  );
}

export default App;
