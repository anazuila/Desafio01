const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Middleware global para contar as requisições feitas
server.use((req, res, next) => {
  
  console.count(` Requests were made.`);

  return next();

});

// Middleware para checar se o projeto existe
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects. find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists.' });
  }

  return next();
}

// apresenta todos os projetos existentes
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// adiciona um novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;  

  const project = {
    id, title, tasks: []
  };
  
  projects.push(project);
  

  return res.json(project);
  
});

// altera o titulo do projeto relacionado ao id da rota 
server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// deleta o projeto relacionado ao id da rota 
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// adiciona uma nova task ao projeto identificado pelo id 
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);

});

server.listen(3000);
