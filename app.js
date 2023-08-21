// Server configurations
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: [
    "http://localhost:4200", // For frontend development server
    "http://localhost:9876", // For frontend test server (karma)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// File System config
const DB_NAME = "./db.json";

// Server initialization
function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start the server");
  }
}

// APIs
app.get("/todos", (request, response) => {
  const todoList = require(DB_NAME);
  let responseData = {
    errorCode: 0,
    errorMessage: "Successful",
    todos: todoList,
  };

  response.json(responseData);
});

app.post("/add", (request, response) => {
  let todo = {
    id: request.body.id,
    data: request.body.data,
  };

  const todoList = require(DB_NAME);
  todoList.unshift(todo);

  fs.writeFile(DB_NAME, JSON.stringify(todoList), (error) => {
    if (error) {
      let responseData = {
        errorCode: 1,
        errorMessage: "Failed to add todo",
      };

      response.json(responseData);
    }

    let responseData = {
      errorCode: 0,
      errorMessage: "Added successfully",
    };

    response.json(responseData);
  });
});

app.delete("/remove", (request, response) => {
  let id = request.query.id;
  const todoList = require(DB_NAME);
  let index = todoList.findIndex((todo) => todo.id === id);

  if (index === -1) {
    let responseData = {
      errorCode: 1,
      errorMessage: "Operation failed",
    };
    response.json(responseData);
  } else {
    todoList.splice(index, 1);

    fs.writeFile(DB_NAME, JSON.stringify(todoList), (error) => {
      if (error) {
        let responseData = {
          errorCode: 1,
          errorMessage: "Operation failed",
        };

        response.json(responseData);
      }

      let responseData = {
        errorCode: 0,
        errorMessage: "Deleted successfully",
      };

      response.json(responseData);
    });
  }
});

app.put("/modify", (request, response) => {
  let id = request.body.id;
  let data = request.body.data;

  const todoList = require(DB_NAME);
  let index = todoList.findIndex((todo) => todo.id === id);

  if (index === -1) {
    let responseData = {
      errorCode: 1,
      errorMessage: "Operation failed",
    };
    response.json(responseData);
  } else {
    todoList[index].data = data;

    fs.writeFile(DB_NAME, JSON.stringify(todoList), (error) => {
      if (error) {
        let responseData = {
          errorCode: 1,
          errorMessage: "Operation failed",
        };

        response.json(responseData);
      }

      let responseData = {
        errorCode: 0,
        errorMessage: "Updated successfully",
      };

      response.json(responseData);
    });
  }
});

// Client
startServer();
