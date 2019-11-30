const express = require("express");
const server = express();

server.use(express.json());
const port = 3000;

let numberOfRequests = 0;
const projects = [];

//Middleware
function checkProjectExists(req, res, next) {
  //recebe id e verifica se ja existe project dentro do array projects
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function checkCreateProjectExists(req, res, next) {
  //recebe id e verifica se ja existe project dentro do array projects
  const { id } = req.body;
  const project = projects.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: "Project already Exist" });
  }

  return next();
}

function totalRequest(req, res, next) {
  //soma toda vez que for chamado
  numberOfRequests++;

  console.log(`Número de requisições foi: ${numberOfRequests}`);

  return next();
}

server.use(totalRequest);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", checkCreateProjectExists, (req, res) => {
  //Inserir project dentro do array projects
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  //
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

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
