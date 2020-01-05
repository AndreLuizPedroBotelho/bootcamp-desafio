const express = require("express");

const server = express();
const PORT = 4870;
let countRequisicao = 0;
server.use(express.json());

server.use((req, res, next) => {
  countRequisicao++;
  console.log(
    `O sistema realizou ${countRequisicao} ${
      countRequisicao > 1 ? "requisições" : "requisição"
    }`
  );
  return next();
});

function checkIdExist(req, res, next) {
  const { id } = req.params;
  const pos = projects
    .map(function(e) {
      return e.id;
    })
    .indexOf(id);

  if (pos < 0) {
    return res.status(400).json({ error: "User does not exists" });
  }
  req.pos = pos;
  return next();
}

const projects = [];

server.get("/projects", (req, res) => {
  res.json(
    projects.sort(function(a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    })
  );
});

server.post("/projects", (req, res) => {
  const params = req.body;

  const pos = projects
    .map(function(e) {
      return e.id;
    })
    .indexOf(params.id);

  if (pos >= 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  projects.push(params);

  res.json(params);
});

server.put("/projects/:id", checkIdExist, (req, res) => {
  const { title } = req.body;

  projects[req.pos].title = title;

  res.json(projects[req.pos]);
});

server.delete("/projects/:id", checkIdExist, (req, res) => {
  projects.splice(req.pos, 1);
  return res.json({ msg: "Deletado" });
});

server.post("/projects/:id/tasks", checkIdExist, (req, res) => {
  const { title } = req.body;

  projects[req.pos].tasks.push(title);

  res.json(projects[req.pos]);
});

server.listen(PORT, () => {
  console.log(`O sistema esta rodando na porta ${PORT}`);
});
