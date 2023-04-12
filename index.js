const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient(process.env.REDIS_URL);

app.get('/counter/:name', (req, res) => {
    const { name } = req.params;
    client.incr(name, (err, value) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(`Counter ${name} incremented to ${value}`);
      }
    });
  });
  
  app.get('/counters', (req, res) => {
    client.keys('*', (err, keys) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        client.mget(keys, (err, values) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          } else {
            const counters = keys.reduce((result, key, index) => {
              result[key] = values[index];
              return result;
            }, {});
            res.send(counters);
          }
        });
      }
    });
  });
  
  app.listen(3000, () => {
    console.log('Counter app listening on port 3000');
  });
