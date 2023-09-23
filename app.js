// Server configurations
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const TodoDB = require("./todoModel");

const app = express();
const PORT = 3000;

//User credentials
const USER = {
  username: "souvik",
  password: "Souvik@1",
};

//DB configs
mongoose.set('strictQuery', false);
async function connectDB() {
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
    "https://cheery-profiterole-caaf28.netlify.app" // For frontend production server
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

//Authentication API
app.post("/authn", (request, response) => {
  let username = request.body.username;
  let password = request.body.password;

  if (username === USER.username && password === USER.password) {
    let responseData = {
      errorCode: 0,
      errorMessage: "Successful",
    };

    response.json(responseData);
  }
  else {
    let responseData = {
      errorCode: 1,
      errorMessage: "Invalid credentials",
    };

    response.json(responseData);
  }
});

// CRUD APIs
app.get("/todos", async (request, response) => {

  try {
    let todoList = await TodoDB.find({}, { id: 1, data: 1, createdOn: 1, _id: 0 }).sort({ createdOn: -1 });;
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
    createdOn: request.body.createdOn
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
    let deletedTodo = await TodoDB.findOneAndDelete({ id: todoId });

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
      { id: todoId },     // Query condition
      { data: todoData }, // Update field and value
      { new: true }       // Return the updated data
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


/**
 * Temp code starts
 */


const questionList = [
  {
    questionNumber: 1,
    questionCount: 3,
    questionText: 'What is the largest planet in our solar system?',
    questionImage: null,
    optionList: [
      {
        optionId: 1,
        optionText: 'Earth'
      },
      {
        optionId: 2,
        optionText: 'Venus'
      },
      {
        optionId: 3,
        optionText: 'Jupiter'
      },
      {
        optionId: 4,
        optionText: 'Saturn'
      }
    ]
  },
  {
    questionNumber: 2,
    questionCount: 3,
    questionText: 'Which fruit is this?',
    questionImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAF0ATQDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAcCAwUGCAEE/8QAQBAAAgIBAgMEBggFAQgDAAAAAAECAwQFEQYhMQcSQVETImFxkcEUFTJCgaGx0SMkUmJyUxczNENjkpOiVXPh/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAQFAgMGAQf/xAA4EQEAAgECAwQIBQMDBQAAAAAAAQIDBBEFITEGEkFRExQiMmGRodFxgbHB4TNCUlPw8RYjNGJy/9oADAMBAAIRAxEAPwDqkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB82fnY+BQ7cq1Vw8N+rfkl4mpajxRlZG8cKH0av+uS7038l+ZHz6rFp43yTswvkrT3m53W10wc7rIVwXWUnsjE5HE2l0vaOQ7X/wBKLl+fQ0S1yus9JfOdtn9Vku8wVGXjf+nX5o1tV/jDbp8X43P0eHky9/dXzLL4wf3dOn+Nq/Y1csZWTGlbLnN+BGnjGonpt8mv1m7bJ8awqSd2BOK9lqb/AENvIOtnKxtye7ZOJbcN1WTUVtOTwScGSbxO4ACybwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMbrmrVaVjqUl6S6fKutPnJ/JH2ZuVVhYtmRfLautbv9iN8zKtzsuzJyH/ABJ9I+EF4JEHX6yNLTePeno1Zsvo4+LzKyLszId+XY7LX08oryS8C0AclkyWyWm153lWzM2neQAousVVblIweLWXkKmOy5zfQxUpOUm5Pds9tnKyblLqykziNnq7iV+mzMer/UtjH4tIm0iLhTH+k8RYMNt1GfpH7kt/2JdOl4PTbDNvOU7TR7O4AC2SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2optvZLm2Bp3Gub6XJqwYP1a/4lntf3V+r+BrhXfe8vJvyZdbpuf4eH5bFBx2vz+nz2t4RyhWZr9+8yAAhNQ2km30RiMu93WcvsrofRqGR/yoP3nwGUQ9AB+ZlEb8oG59muH38vLzJLlXFVRe3i+b/JL4m/mJ4X036r0amia2ul69n+T/boZY7LS4fQ4q08lpjr3axAACQzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZxLe8bQsycXtJw7kffLl8zJmu8c2d3Saq/8AUvivhu/ka81+5jtbyiWNp2rMtNSSSS6IAHCqkLGZeqa+X2n0Ksi6NMN318EYiyyVk3KT3bPYgUt7vd9QAZvQ2fgbRXn5yzL4/wAtjy3W/wB+f7I+DhvQb9ayN1vXiQf8S35R83+hKuJjU4eNXRjQVdUFtGKLrhmhmZjNkjl4fdKwYufeldAB0CaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq/Hb/l8GPnc38Iv9zaDCcT6VfqlWOsadcZ1Scv4m+z3W3gaNVS18Nq16zDDJEzWYhox82Rlwr5Q9aRmbuENZsezuxe77JNfI8jwJqDXrZWKv+5/I5mOF6n/AB+sIHq+TyapZZKyXem92Um84/AXJfSM97+Krr+bfyMti8GaTQ07IW5DX+rPl8FsjfThGa3vbQzjTXnqjXFx7su1V4tNl1j+7CO5uOh8Eyn3bdXl3V1VFb6/5P8AY3fGxqcWtV41UKoL7sI7Iulnp+F4sU963tSkU09a855rePTVj0xqorjXXFbKMVskXACzbwAAAAAAAAAAAAAAAAAAAAAAAAAAAYbXOJ9J0SD+n5lcbPCqD703+CNB1btYe7jpOAvZO9/Jfua75qU96U3TcP1Oq/o0mY8/D5pXPJTjH7UkveznrUeOuIM6T7+fOqL+7SlBGCyNQzMh735V9n+VjZGtrqR0hdYuyuptzvaI+rpuzOxK/wDeZVEP8rEihangN7LNxW//ALY/ucvOUn1bf4jd+bNfr8f4pX/SVv8AV+n8uqY3VTW8LISXskmVnK9eRdU967bIP+2TRk8LiXWcKXex9SyY+xzcl8GZxr6+MNGTspnj3LxPzj7ulQQlpfalrGPtHNpx8uHnt3JfFcvyNt07tS0e9JZlORiy89u+vyN9NTjt0lVajgutwe9jmY+HP9EgAwGNxjw/kpOvVcZeycu6/wAy++J9DS3erYX/AJkbu9E+KunDkrO01n5MwDVc3j7h3FX/AB6uflTFyNY1TtZpjvHTNPlN+Er5bL4I12zY69ZSsPDdXnn/ALeOflt9ZSiG0urS95AGpdofEOduo5UcaD+7RDu/n1NeyNW1DJb9Pm5Nm/8AVY2R7a7HHSN1vi7Laq8b3tFfq6ZtzMapb25FMP8AKaRbWqYD6Z2L/wCaP7nL8pyl9qUn72ebvzMPX4/xS47JW8cv0/l1PXk0WL+HdVL/ABkmXU0+hyrG2yD3jOSfsZkMTXtWw5J42o5UNvBWPb4Hsa+vjDXk7J5o9zJE/jEx93TQIK0rtM1zD2jkunMh/wBWO0vijddG7UNKy3GGoVWYc395+tD4o301OO/SVTqeCa3T87U3jzjn/KQAWMPLx82lW4l9d9T6SrkpIvkhU7bAAAAAAAAAAAAAAAAABonHfHtGiKeHprhfqG2zfWNXv837DG94pG9m7T6fJqckY8UbzLZuIOINO0HG9LqF8YN/ZrXOc/ciIuJu0jU9Tc6tP/ksV8vVfryXtfh+BpuoZ2TqOVPIzbp3XTe7lJnzFXm1lr8qcod1w7s5hwRF9R7VvpH3/NVZOVk3OyUpSfNuT3bKQCH1dJERWNoAAHoAAAAAAAAAAAAAAAAAAAAAAAD79J1fP0i9W6fk2US8VF8n714kpcKdp1OTKGPr0I0WPkr4L1H714EPA34tRfH0nkqtdwfTa2N712t5x1/l1VTbXfVGymcbK5LeMovdNFZzxwhxhn8O3qMJO7Cb9eib5e9eTJ04f1vC17BjlYFqlHpKD+1B+TRaYc9cscurguI8KzcPt7fOs9J/30lkwAb1YAAAAAAAAAGk9pXFq0LB+iYU19Y3p7bf8uP9Xv8AIxvaKR3pbtPgvqMkYscbzLG9o/HS09T0zR7E8t8rblz9F7F7f0IcnOU5ynOTlKT3bb3bZ5OUpycptyk3u2+rPClzZrZZ3no+mcM4Zj4fj7tedp6z5/wAA0rMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMrw3ruZw/qEcrCnt4Trf2ZryZige1tNZ3hqzYaZ6TjyRvEul+GdexOIdNjlYcua5WVv7UJeTMsc28JcQ5PDuqQyaG5VS5W1b8px/c6I0vPx9TwKcvDsU6bY7pr9H7S50+eMtfi+a8X4Xbh+XaOdJ6T+34vqABIVIAAAAAx3EOr0aJpN+dkv1a16sfGUvBI5u1bUL9U1C/My59622Tk/Z7F7Dde13iB6hqy03Hl/LYj9bb70/H4EflVrM3et3I6Q77s3w6MGL1m8e1bp8I/kABCdOABJvoABdWPc1uq57e4tyi4vaSaftDyJiejwAB6AAAAAAAAAAAAAAAAAAAAAAAAAAAAABv/ZRxN9V6l9W5c/5PKklFvpCfh+DNAPYtxacW01zTRsxZJx2i0IWv0dNbgthv49PhLqwGr9nev8A19w/XO2SeVR/Dt9r8H+JtBe1tFo3h8ry4rYbzjvG0xyAAetYYnirVo6LoOXmya70IbQT8ZPoZYintu1Tlg6ZXLzusX5R+Zry39HSbJnD9LOr1FMPnP08foiu6yd1s7LJOU5tyk34tlABQzO76vWsVjaOgAV01ytsjCC5sPZnbnK5iY08me0FyXV+RncbEqoj6sU5eLZXjURoqUIr3vzLpurXZW5s83naOgYzW4R9FCWy72+25kzCazd371Wnyh+ov0eaeJnJGzHAA0rQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABuXZZrT0riWumye2Nl/wpp9N/uv4/qT2cqVzlXZGcHtKLTT8mdM8N6lHVtDw82L3dtacvZLx/MtNDk3rNJ8HB9qNJ6PNXUV6W6/jH8foyQAJzlg5z4+1H6z4sz7lLeEJ+ih7o8joXUMhYmBkZD6VVyn8Fuct2zdls5y5uTbZB11tqxXzdV2Vwd7PfLP8AbG3z/wCFIAKt3YZjRsfuwd0lzfJGJhFznGK6t7Gz1QVdcYLolsZ4457ouqvtXux4qwAblcousVVUpvokaxZNznKUure5l9bu2hGpPm+bMMack89ljpabV73mAAwSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmbsU1D0+jZeFKW8sexSiv7Zf/qZDJv/AGM5voOJrcdtKORS1z809/3JOjt3csfFRdosEZdDafGu0/t+kpuABcvm7X+0DI+jcH6pNPZupwX48jnInrtct9HwZfFffshH89yBSr18+1EO67KU2wZL+c/pH8gAILq316XDv5kPJczYTC6HHe+b8omaN1Oit1U732ACm2XdrlLyW5mjte1G30uXN78k9kfMet7tt+J4RpndcVjuxEAADIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxtJbsDyclGO7M32d5foONtLsm/Vdvc+K2Natm5y9ngZDhm30HEWm2vpDIrf/sjZina8T8UTX4+/pclf/Wf0dUgAvnyVonbI2uElt43x+ZBpO3bBBy4PnJL7N0GyCSq139SPwd92V/8AFt/9ftAACE6dldC+1b7kZcw2hy2usj5ozJup0Vep/qSFnNe2Lb/iy8WM7/hLf8TKejVT3oa0ACOuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+a+zvPuroiu+zZd1dT5g9iA+rS21qWK11Vsf1PlMhw/U7tc0+pLdzvhH/2RlT3oaNVO2C8z5T+jqwAHQPkDV+0yh38F6ikt+5FT+DRz0dO8Q430zQtQx9t3ZRNJe3bkcxNbPZ9St18c6y7bsnk3x5aeUxPz/wCAAFe699emWejzIb9HyNhNUi3GSa6rmbLiXK+iM118febcc+CDq6c4svFnLW+Nav7WXii5b1TXsZnKJXlMNWABHXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFk+5HfxKpNJbs+SybnLdghS2292eABkGf4Dx5ZPGGk1x6+njL4c/kYA3jsdxPpPGuPNp7UVzs3/AA2+ZtwRvkrCv4rk9Ho8tvhP15OhAAXr5QHM/FWD9W8Rahi7bRrul3V7G91+R0wQn2z6f9G4ipy4x2hlVdf7o8n8iJra749/J0XZnP6PWdyf7omP3R8ACofQw+rAy3jT584Pqj5QInZjasWjaW01WwtipVyTR5kzVdE5S6JM1quydb3hJxfsZVZfbatrLJSXkzZ6Tkh+qe1ynktAA1pwAAAAAAAAAAAAAAAAAAAAAAAAAAABYvs29WP4gUX2d57Loi0AGQAABMPYLgbV6pqEk+bjTB/m/kQ8dH9lmnfV3BmEpR7tl+90vx6flsTNFXfJv5Oa7UZ/R6SMcf3T9I5/ZtoALZ89DRe2DTfpnDCyYx3sxLFPf+18n8jej5tTxIZ+nZOJak4XVuD/ABRjevfrNZ8W/TZpwZa5Y8JiXLYL2ZjzxMu7HuW1lU3CS9qZZOfmNp2l9bpeL1i1ekgADMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACiyahH2geXWdxbLqz5RJuT3Z4HoAA9AAB9ujYU9S1bEw61611sYfFnVlFUKKK6qltCuKjFeSS2IJ7FdJebxNPNnHerDh3t/7nyXzJ5LbRU7tO95vnvajU+l1UYo6Uj6zz+wACY5oAAEG9r2kfQOI1l1x2qzI9/l/UuT+RohPvaloz1bhmydUd78R+mj5tfeXw/QgIp9Zj7uTfzfRezmr9PpIxz1py/Lw+35AAIroAAAAAAAAAAAAAAAAAAAAAAAAAAAACmc1BbsBOagt2fJOTk92Jyc3uykPYgAAegAAAGW4W0mzW9exMGtcrJrvvyiur+B7Ws2mKw1Zs1cGO2W/SI3Th2R6P9V8J1W2R2uzH6aXnt938v1N2KKa4U0wqriowhFRil4JFZf1rFaxWHyLPmtnyWy26zO4ADJqAAB5KKlFxkk4tbNPxOb+M9HlonEWVibbVd7v1Pzi+h0iR/2vaB9YaRDUceG+Rib9/Zc5QfX4EbVYvSU5dYXXAdd6pqo70+zblP7ShIAFM+lgAAAAAAAAAAAAAAAAAAAAAAAABbstUOXVgVWTUFzPknJze7PJScnuzwPYgAAegAAAAATN2G6Gq8XK1i+Hr2P0VLa6RX2n+nwIo0PTbtX1XGwcZb2XTUfcvFnUWk4FOl6bj4WLHu1UwUF7faTtDi3t358HJ9qdd3MUaWs87c5/D+Z/R9YALRwgAAAAAFNkI2VyhZFShJbNPo0VADnHjbQp6Br1+N3X6CT79MvOL/boYA6E7Q+HFxBoklVFfTaN50vz84/ic+Si4ScZJqSezT8Cm1WH0d946S+kcB4j65p+5afbryn4+UvAARl6AAAAAAAAAAAAAAAAAAACidkYLm+fkfPZZKfsXkDZctu8IfEsPmeAMgAAAAAAAAA2Lgbh2ziTXasVJrHh698/KP7sypSb2isNGo1FNNitlyTyhI3Ynw59Hxbdayq/4l3qUbrpHxf4kqFvHprxqK6aIKFVcVGMUtkki4XuOkY6xWHyjWaq+rzWzX6yAAzRgAAAAAAAAhPtd4Vlp2W9Z0+H8rfL+NBLlCfn7mTYWc7EozsS3Gyq42UWxcZRl0aNeXFGWvdlN4frb6HPGan5x5w5Shen9rky6mn0ZleOOGb+GdYnjz3ljWbyos/qj5e9GuptdHsUd6TSe7L6lp8+PU4oy4p3iX3A+aN8l15lyN8X15GLdsug8Uovo0egAAAAAAApc4rq0BUCzK+K6JstStlLx2QNn0TsjHqyzO5v7PJFkB7s9PAA9AAAAAAAAAABdxqLMnIrpog522SUYxS5ts6Q7P8AhivhnRY1S7ssy7ad80vH+n3I1Lsf4P8Ao1S1vUq16aa/loSX2V/V734EqFrpMHcjv26y+e9oeLetZPV8U+xX6z9oAATXNAAAAAAAAAAAAADD8VaBicR6VZh5cUn1rs25wl5o5t1/R8vQ9Stws6txsg+T8JLwa9h1Ua9xnwticT6d6HISryIbum5LnB/NewjajTxljeOq74Nxe3D792/Ok9fh8YcyAyev6Lm6FqE8TUKnCxdJeEl5pmMKe1ZrO0vpGLLTNSMmOd4kKlKS6NlIPGxWrZ/1M99NPzLYAuemn5njsn/UygAeuTfVs8AAAAAAAAAAAAAAAAAAEi9lvBMtZyIanqUNtPqlvCEl/vpL5Fjs44Et1+6ObqEZVaZB9OjufkvZ7Se8emrHphTRXGuqC7sYRWySLDS6bf27uP49xyKxOl008/Gf2j91cUopKKSS5JLwABZOIAAAAAAAAAAAAAAAAAABh+J+HsHiPAeNn17tc67F9qD80c+8YcJ5/DOX3MqPpMaT/h3xXqy/ZnTRYzsPHz8WzHzKYXUzW0oTW6ZozaeuWOfVbcM4vm4fb2edZ6x9vKXJQJV4x7LLsdzyuHpO6rm3jS+1H/F+JF19NmPbKq+uVdkXs4yWzRU5cN8U7Wh9C0PEtPrq74rc/LxhbABqTwAAAAAAAAAAAAAAAAAzHD3Dmp6/kei07HlNJ7SsfKEfez2tZtO1Yas2fHgpN8ttojzYiKcmlFNt8kkSr2f9ms8n0eocQQcKeUq8Z8nL2y8l7DbuC+zzT9AcMnKazM9c1OS9WD/tXzN4LPBo4r7V+riOLdo7Z4nDpeVfGfGfw8v1U1VwpqjXVCMK4raMYrZJFQBOcoAAAAAAAAAAAAAAAAAAAAAAAAGD4j4W0niCvbUMaLt25XQ9Wa/EzgPJiJjaWVL2x2i1J2mEH8Q9k2o4nes0i+GZX/pyXcmvkyP9R0zN021152LdRNeE4tHWBbyMenJrcMiqu2D+7OKkvzImTRUt7vJ0Wk7T6rDyyxF4+U/P+HI4OkdS7PuHM/dywI0zf3qZOJrmX2P6bP8A4XUcqn/OKn+xGtobx0ndeYe1Wlv/AFKzX6/7+SEQS1kdjlqf8vq8JL++lr9Gy3Dscy9/X1WhL2Vtmv1TL5JcdouH7b9/6T9kUgmOjscpTTv1ex+ajQl+e59eT2P6ZKCWPqGVXPxcoxkn+HI99Sytc9ptDE7RMz+SEQS3f2OWJ/y+rwkv76Wv0bLH+x3O/wDlMb/skeeqZfJtjtFw+f7/AKT9kVgmGjsbr7qd+sS73ioUcvi2ZjB7J9CokpZFuVkbdVKSin8DKNFknq0ZO0+ip7u8/l99kDpbvkZ/Q+ENb1pp4eFYqn/zbF3Y/FnQWl8LaJpiX0PTceMl96Ue9L4szSWy5G+mgiPelU6ntZktG2Cm3xnn9EYcN9k2HiyjdrWR9Kmufoq13Yfi+rJJxMWjDojRiU101R5KEI7JF4E2mOuONqw5nU6zPqrd7NaZkABmjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9k=',
    optionList: [
      {
        optionId: 1,
        optionText: 'Mango'
      },
      {
        optionId: 2,
        optionText: 'Apple'
      },
      {
        optionId: 3,
        optionText: 'Banana'
      },
      {
        optionId: 4,
        optionText: 'Orange'
      },
      {
        optionId: 5,
        optionText: 'Grapes'
      }
    ]
  },
  {
    questionNumber: 3,
    questionCount: 3,
    questionText: 'What is the capital of India?',
    questionImage: null,
    optionList: [
      {
        optionId: 1,
        optionText: 'Bengaluru'
      },
      {
        optionId: 2,
        optionText: 'New Delhi'
      },
      {
        optionId: 3,
        optionText: 'Kolakata'
      }
    ]
  }
];

const answerList = [
  {
    optionId: 3,
  },
  {
    optionId: 2,
  },
  {
    optionId: 2,
  }
];


app.get("/question", async (request, response) => {
  let questionNumber = Number(request.query.questionNumber) - 1;
  let responseData = questionList[questionNumber];
  response.json(responseData);
});


app.post("/submit", async (request, response) => {
  let questionNumber = request.body.questionNumber - 1;
  let selectedOptionId = request.body.selectedOptionId;

  let isCorrect = false;

  if (answerList[questionNumber].optionId === selectedOptionId) {
    isCorrect = true;
  }

  let responseData = {
    isAnswerCorrect: isCorrect
  };

  response.json(responseData);
  
});

app.get("/report", async (request, response) => {
  let correct = Number(request.query.correct);
  let inCorrect = Number(request.query.inCorrect);
  
  let responseData = {
    correct: correct,
    inCorrect: inCorrect
  }
  response.json(responseData);
});

/**
 * Temp code ends
 */

// Client
connectDB().then(() => {
  startServer();
});
