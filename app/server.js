const express = require('express');

const app = express();

app.get('/', (req, resp) => {
  resp.send('Hello From Express App');
});

app.listen(process.env.PORT || 3000);
