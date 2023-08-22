// Server configurations
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const TodoDB = require("./todoModel");

const app = express();
const PORT = 3000;

//DB configs
mongoose.set('strictQuery', false);
async function connectDB () {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${db.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// API configs
const corsOptions = {
  origin: [
    "http://localhost:4200", // For frontend development server
    "http://localhost:9876", // For frontend test server (karma)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

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
app.get("/todos", async (request, response) => {

  try {
    let todoList = await TodoDB.find();
    let responseData = {
      errorCode: 0,
      errorMessage: "Successful",
      todos: todoList,
    };
  
    response.json(responseData);
  } catch (error) {
    let responseData = {
      errorCode: 1,
      errorMessage: error.message,
    };
  
    response.json(responseData);
  }
});

app.post("/add", async (request, response) => {
  let newTodo = new TodoDB({
    id: request.body.id,
    data: request.body.data,
  });

  try {
    await newTodo.save();
    let responseData = {
      errorCode: 0,
      errorMessage: "Added successfully",
    };

    response.json(responseData);
  } catch (error) {
    let responseData = {
      errorCode: 1,
      errorMessage: error.message,
    };

    response.json(responseData);
  }
});

app.delete("/remove", async (request, response) => {
  let todoId = request.query.id;

  try {
    let deletedTodo = await TodoDB.findOneAndDelete({id: todoId});

    if (deletedTodo) {
      let responseData = {
        errorCode: 0,
        errorMessage: "Deleted successfully",
      };
  
      response.json(responseData);
    }
    else {
      let responseData = {
        errorCode: 1,
        errorMessage: "Item not found",
      };
  
      response.json(responseData);
    }
  } catch (error) {
    let responseData = {
      errorCode: 1,
      errorMessage: error.message,
    };

    response.json(responseData);
  }
});

app.put("/modify", async (request, response) => {
  let todoId = request.body.id;
  let todoData = request.body.data;

  try {
    let updatedTodo = await TodoDB.findOneAndUpdate(
      {id: todoId},     // Query condition
      {data: todoData}, // Update field and value
      {new: true}       // Return the updated data
    );

    if (updatedTodo) {
      let responseData = {
        errorCode: 0,
        errorMessage: "Modified successfully",
      };
  
      response.json(responseData);
    }
    else {
      let responseData = {
        errorCode: 1,
        errorMessage: "Item not found",
      };
  
      response.json(responseData);
    }
  } catch (error) {
    let responseData = {
      errorCode: 1,
      errorMessage: error.message,
    };

    response.json(responseData);
  }
});

// Client
connectDB().then(() => {
  startServer();
});
