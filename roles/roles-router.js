const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/roles.db3"
  },
  debug: true
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  // returns a promise that resolves to all records in the table
  db("roles")
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  // get the roles from the database
});

router.get("/:id", (req, res) => {
  // retrieve a role by id
  const { id } = req.params;

  db("roles")
    .where({ id })
    //.first()
    .then(role => {
      res.status(200).json(role[0]);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // get back an array with the last id generated
  db("roles")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("roles")
        .where({ id })
        .first()
        .then(role => {
          res.status(201).json(role);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update roles
  db("roles")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // remove roles (inactivate the role)
  db("roles")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
