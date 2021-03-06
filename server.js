require('newrelic');
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const express = require('express');
  const path = require('path');
  const axios = require('axios');
  const app = express();
  const port = process.env.PORT || 3000;

  app.use('/', express.static(path.join(__dirname, 'public')));
  app.use('/stocks/:ticker', express.static(path.join(__dirname, 'public')));

  const axios3001 = axios.create({
    baseURL: 'http://localhost:3001',
  });

  const axios3002 = axios.create({
    baseURL: 'http://localhost:3002',
  });

  const axios3003 = axios.create({
    baseURL: 'http://localhost:3003',
  });

  const axios4000 = axios.create({
    baseURL: 'http://localhost:4000',
  });

  app.use('/api/ratings/:ticker', (req, res) => {
    axios3001.get(`/api/ratings/${req.params.ticker}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.use('/api/history/:ticker', (req, res) => {
    axios3001.get(`/api/history/${req.params.ticker}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.use('/api/stocks/:ticker', (req, res) => {
    axios3002.get(`/api/stocks/${req.params.ticker}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.use('/api/accounts/:account_number', (req, res) => {
    axios3002.get(`/api/accounts/${req.params.account_number}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.get('/api/about/:symbol', (req, res) => {
    axios3003.get(`/api/about/${req.params.symbol}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.delete('/api/about/:symbol', (req, res) => {
    axios3003.delete(`/api/about/${req.params.symbol}`)
      .then(count => res.send(count))
      .catch(err => res.send(err));
  })

  app.post('/api/about/', (req, res) => {
    axios3003.post(`/api/about/`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.get('/api/users/:userId', (req, res) => {
    axios3003.get(`/api/users/${req.params.userId}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.delete('/api/users/:userId', (req, res) => {
    axios3003.delete(`/api/users/${req.params.userId}`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  app.post('/api/users', (req, res) => {
    axios3003.get(`/api/users`)
      .then(response => res.send(response.data))
      .catch(err => res.send(err));
  })

  // app.use('/stocks/tags/:tag', (req, res) => {
  //   axios3003.get(`/stocks/tags/${req.params.tag}`)
  //     .then(response => res.send(response.data))
  //     .catch(err => res.send(err));
  // })

  // app.use('/api/:stockId', (req, res) => {
  //   axios4000.get(`/api/${req.params.stockId}`)
  //     .then(response => res.send(response.data))
  //     .catch(err => res.send(err));
  // })

  // app.get('/:stockId', (req, res) => {
  //   axios4000.get(`/api/${req.params.stockId}`)
  //   .then(response => res.send(response.data))
  //   .catch(err => res.send(err));
  // })

  app.listen(port, () => {
    console.log(`proxy server running at: http://localhost:${port}`);
  });
}