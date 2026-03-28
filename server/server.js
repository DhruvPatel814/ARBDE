const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { evaluateGraph } = require('./engine/evaluator');

const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/evaluate', async (req, res) => {
  try {
    const { graph, data } = req.body;
    if (!graph || !graph.nodes || !data) {
      return res.status(400).json({ error: 'Invalid payload. "graph" and "data" are required.' });
    }

    const result = await evaluateGraph(graph, data);
    res.json(result);
  } catch (err) {
    console.error('Evaluation Error:', err);
    res.status(500).json({ error: err.message || 'Internal evaluation error' });
  }
});

const PORT = typeof process !== 'undefined' && process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`Node Rule Engine Server running on port ${PORT}`);
});
