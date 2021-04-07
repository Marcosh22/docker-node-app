const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

async function getConnection() {
        
    const connection = await mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'root',
        database:'nodedb'
    });

    return connection;
}

async function createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS people (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255),
        PRIMARY KEY(id) 
    )`;

    const conn = await getConnection();
    await conn.execute(sql);

    conn.end();

    return true;
}

async function insertPerson(name) {
    const sql = `INSERT INTO people(name) values('${name}')`;

    const conn = await getConnection();
    await conn.execute(sql);

    conn.end();

    return true;
}

async function getPeople() {
    const sql = `SELECT * FROM people`;

    const conn = await getConnection();
    const [rows] = await conn.execute(sql);

    conn.end();
   
    return rows;
}

createTable();

app.get('/', async (req, res) => {

    let people = await getPeople();

    let html = `<h1>Full Cycle</h1>`;

    html += `<form method="GET" action="/adicionar" style="width: 300px;">
        <fieldset>
            <legend>Adicionar nova pessoa:</legend>
            <input type="text" name="nome" placeholder="Nome">
            <input type="submit" value="Adicionar">
        </fieldset>
    </form>`;
    
    if(people && people.length > 0) {
    
        html += `<h3>Pessoas cadastradas:</h3>`;
        
        html += `<ul>`;
    
        people.forEach((person) => {
            html += `<li>${person.name}</li>`;
        });
    
        html += `<ul/>`;
    }

    return res.send(html);
});

app.get('/adicionar', async (req, res) => {
    let name = req.query.nome;

    if(!name) return res.send('<h3 style="color: red;">Erro: Passe um valor no parâmetro \'nome\' para salvar.</h3><br/><a href="/" style="color: red"><- Voltar</a>');

    await insertPerson(name);

    return res.send('<h3>Pessoa salva com sucesso!</h3><br/><a href="/" style="color: red"><- Voltar</a>');
});

app.listen(3000);