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

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = typeof process !== 'undefined' && process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`Node Rule Engine Server running on port ${PORT}`);
});
