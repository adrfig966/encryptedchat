const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const crypto = require("crypto");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// fake DB
const messages = ["hellur!"];

const rooms = {};

// socket.io server
io.on("connection", (socket) => {
  console.log("A user connected");
  var userroom = "/";
  socket.join(userroom);

  socket.on("joinroom", (data) => {
    socket.leave(userroom);
    userroom = data.roomname;

    if (!rooms[userroom]) {
      console.log("Room does not exist, creating it");
      console.log("Host is: ", socket.id);
      var { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 1024,
      });

      rooms[userroom] = {
        users: [socket.id],
        messages: [],
        host: socket.id,
        publicKey,
      };

      io.to(socket.id).emit("host", {
        privateKey: privateKey.export({
          type: "pkcs1",
          format: "pem",
        }),
        publicKey: publicKey.export({
          type: "pkcs1",
          format: "pem",
        }),
      });
    } else {
      console.log("Room exists");
      rooms[userroom].users.push(socket.id);
      //Catch user up on messages
      socket.emit("messages", { messages: rooms[userroom].messages });
    }
    socket.join(data.roomname, (err) =>
      err ? console.log("Could not join room") : console.log("Success")
    );
    console.log("A user has joined room ", data.roomname);
    console.log("Current room state", rooms);
  });

  socket.on("message", (data) => {
    const encryptedMsg = crypto.publicEncrypt(
      {
        key: rooms[userroom].publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(data.message)
    );
    var newData = data;
    newData.message = encryptedMsg.toString("base64");
    rooms[userroom].messages.push(newData);
    io.to(userroom).emit("messages", { messages: rooms[userroom].messages });
    console.log("A message was received:", data);
  });

  socket.on("disconnect", () => {
    if (!rooms[userroom]) {
      return;
    }
    rooms[userroom]["users"] = rooms[userroom]["users"].filter(
      (user) => user != socket.id
    );
    if (rooms[userroom]["users"].length == 0) {
      delete rooms[userroom];
    }
    console.log("A user has left room ", userroom);
    console.log("Current rooms state", rooms);
  });
});

nextApp.prepare().then(() => {
  app.get("/messages", (req, res) => {
    io.emit("message", { text: "Test ping!" });
    res.json(messages);
  });

  app.post("/genkey", (req, res) => {
    var newkey = crypto.createPrivateKey(req.body.privateKey);
    console.log("New private key created");
    res.json({
      privateKey: newkey.export({
        type: "pkcs1",
        format: "pem",
      }),
    });
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Listenin on port 3k");
  });
});
