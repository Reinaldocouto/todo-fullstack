import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = {
  Pendente: "#fff3cd",
  Concluída: "#d4edda",
  "Em Progresso": "#cce5ff",
  Cancelada: "#f8d7da",
  Aguardando: "#e2e3e5",
};

export default function StatusChart({ tarefas }) {
  // Conta quantas tarefas há de cada status
  const counts = tarefas.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  // Converte em array para o Recharts
  const data = Object.entries(counts).map(([status, value]) => ({
    name: status,
    value,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || "#cccccc"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
