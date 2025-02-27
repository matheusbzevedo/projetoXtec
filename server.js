const express = require('express'),
  https = require('https'),
  axios = require('axios'),
  fs = require('fs'),
  parser = require('xml2js').parseString,
  app = express(),
  cron = require('cron').CronJob,
  json = require('./temp/arquivo.json') || "",
  port = 3000;

//0 5 * * *

const agent = new https.Agent({ rejectUnauthorized: false });

// async function saveXML() {
//   try {
//     const response = await axios.get('https://webservice.aldo.com.br/asp.net/ferramentas/integracao.ashx?u=79443&p=xt3cc0', { httpsAgent: agent });
    
//     fs.writeFile('./temp/arquivo.xml', response.data, (error) => {
//       console.error(error);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

function convertToJSON() {
  fs.readFile('./temp/arquivo.xml', 'utf-8', (error, data) => {
    if (error ) return console.error(error);

    parser(data, (err, result) => {
      if (err) return console.error(err);

      fs.writeFile('./temp/arquivo.json', JSON.stringify(result), (errorFS) => {
        if (errorFS) return console.error(errorFS);

        console.info('Transformação em JSON finalizada!');
      });
    });
  });
}

new cron('* * * * *', () => {
  console.log('teste')
}).start();

app.use(express.json());
app.use(express.static('./app/dist/CalculadoraSolar/'));

app
.get('/dados', (request, response) => {
  response.status(200).json(json);
})
.get('/', (request, response) => response.sendFile('./app/dist/CalculadoraSolar/index.html'));

app.listen(port, () => console.info(`Servidor rodando na porta: ${port}`));