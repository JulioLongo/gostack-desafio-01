const express = require("express");
const server = express();

server.use(express.json());
const port = 3000;

let numberOfRequests = 0;
const projects = [];

// Middleware Global para somar número de requests
function totalRequest(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições foi: ${numberOfRequests}`);

  return next();
}

// Adicionaro middleware global
server.use(totalRequest);

// Middlewares 
// Recebe id e procura se existe project dentro do array projects
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

// Recebe id e verifica se ja existe project dentro do array projects
function checkCreateProjectExists(req, res, next) {
  const { id } = req.body;
  const project = projects.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: "Project already Exist" });
  }

  return next();
}

// Lista todos projetos e suas tarefas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Insere project dentro do array projects
server.post("/projects", checkCreateProjectExists, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// Altera o titulo do projeto com base no ID
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// Deleta o o projeto com base no ID
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// Cria o tarefas no projeto com base no ID
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(task);

  return res.json(project);
});

server.listen(port, () =>
  console.log(`Example app listening on port port ${port}`)
);
