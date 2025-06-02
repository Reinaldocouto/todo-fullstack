// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = require('./db');

app.use(cors());
app.use(express.json());

// ROTA DE HEALTH CHECK
app.get('/ping', (req, res) => res.send('pong'));

// GET /tarefas → lista todas as tarefas
app.get('/tarefas', async (req, res) => {
  try {
    
    const [rows] = await pool.query(
     'SELECT * FROM tarefas ORDER BY datacriacao ASC'
   );
    res.json(rows);
  } catch (err) {
    console.error('ERRO AO LISTAR TAREFAS →', err);
    res.status(500).json({ erro: 'Falha ao listar tarefas' });
  }
});

// POST /tarefas → cria uma nova tarefa
app.post('/tarefas', async (req, res) => {
  const { titulo, descricao, status } = req.body;
  if (!titulo || !status) {
    return res.status(400).json({ erro: 'Campos “titulo” e “status” são obrigatórios' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO tarefas (titulo, descricao, status, datacriacao) VALUES (?, ?, ?, NOW())',
      [titulo, descricao || null, status]
    );
    const [nova] = await pool.query('SELECT * FROM tarefas WHERE id = ?', [result.insertId]);
    res.status(201).json(nova[0]);
  } catch (err) {
    console.error('ERRO AO CRIAR TAREFA →', err);
    res.status(500).json({ erro: 'Falha ao criar tarefa' });
  }
});

// PUT /tarefas/:id → atualiza tarefa
app.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status } = req.body;
  if (!titulo || !status) {
    return res.status(400).json({ erro: 'Campos “titulo” e “status” são obrigatórios' });
  }
  try {
    const [updateResult] = await pool.query(
      'UPDATE tarefas SET titulo = ?, descricao = ?, status = ? WHERE id = ?',
      [titulo, descricao || null, status, id]
    );
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    const [atualizada] = await pool.query('SELECT * FROM tarefas WHERE id = ?', [id]);
    res.json(atualizada[0]);
  } catch (err) {
    console.error('ERRO AO ATUALIZAR TAREFA →', err);
    res.status(500).json({ erro: 'Falha ao atualizar tarefa' });
  }
});

// DELETE /tarefas/:id → remove de vez
app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [deleteResult] = await pool.query('DELETE FROM tarefas WHERE id = ?', [id]);
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('ERRO AO EXCLUIR TAREFA →', err);
    res.status(500).json({ erro: 'Falha ao excluir tarefa' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
