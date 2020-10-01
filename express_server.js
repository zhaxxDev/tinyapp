const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
 
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");



function generateRandomString() {
  var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  DIt6os:
   { id: 'DIt6os',
     email: 'alex.xian@hotmail.com',
     password: 'test' } 

}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/urls/new", (req, res) => {
  const templateVars = {
    users, userID: req.cookies["user_ID"]
    // ... any other vars
  };
   let statua = false;
   for (let name in users) {
     if (name === req.cookies["user_ID"]) {
       statua = true;
     }
   }
   if (statua !== true) {
     res.redirect("/login")
   }
  res.render("urls_new", templateVars);
});

 app.get("/fetch", (req, res) => {
  const templateVars = {
    users, userID: req.cookies["user_ID"]
    // ... any other vars
  };
  res.send(`a = ${a}`);
 });

 app.get("/urls", (req, res) => {
  const templateVars = {
    users, userID: req.cookies["user_ID"], 
    // ... any other vars
    urls: urlDatabase
  };
   
  res.render("urls_index", templateVars);
});     

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.get("/login", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], users, userID: req.cookies["user_ID"] };
  res.render('_login', templateVars)
});

app.post("/login", (req, res) => {
  let userN = req.body.email;
  let userP = req.body.password;
  if (req.body.email === '' && req.body.password === '') {
    res.status(400).end();
  }
  let usID = ''
  let statusP = false;
  let statusS = false;
  for (let name in users) {
    if (userN === users[name].email){
      statusS = true;
      console.log(statusS)
    }
  }
  for (let name in users) {
    if (userP === users[name].password){
      statusP = true;
      console.log(statusP)
      usID = name;
    }
  }
  if (statusS !== true || statusP !== true) {
    res.status(403).end();
  }
  res.cookie("user_ID", usID)

  res.redirect('/urls')
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, userID: req.cookies["user_ID"] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, userID: req.cookies["user_ID"] };
  console.log(templateVars)
  console.log(req.body)
  if (req.body.newURL) {
    let a = req.params.shortURL;
    urlDatabase[a] = req.body.newURL;
    res.redirect(`/urls`)
  }
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  let URLA = req.params.shortURL
  res.redirect(urlDatabase[URLA].longURL);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_ID")
  res.redirect('/urls')
});

app.get("/register", (req, res) => {
  const templateVars = {
    users, userID: req.cookies["user_ID"]
    // ... any other vars
  };
  res.render("_register", templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);
  let latestURL = generateRandomString();
  urlDatabase[latestURL] = { longURL: req.body.longURL, userID: req.cookies["user_ID"]};
  console.log(urlDatabase)
  res.redirect(`/urls/${latestURL}`)
});

app.post("/register", (req, res) => {
  let latestUSER = generateRandomString();
  if (req.body.email === '' && req.body.password === '') {
    res.status(400).end();
  }
  for (let name in users) {
    let sample = users[name].email;
    if (sample === req.body.email){
      res.status(400).end();
    }
  }
  users[latestUSER] = { id: latestUSER,
     email: req.body.email,
      password: req.body.password
  };
  res.cookie("user_ID", latestUSER)
  console.log(users)
  res.redirect(`/urls`)
});