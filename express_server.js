const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session')
var Keygrip = require('keygrip')
const getUserByEmail = require('./helpers')

app.use(cookieSession({
  name: 'session',
  keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64'),

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

function urlsForUser(id) {
  let as = {};
  for (let a in urlDatabase) {
    let bs = a
    console.log(bs)
    if (urlDatabase[a].userID === id){
      as[a] = urlDatabase[a] 
    }
  }
  return as
}

function generateRandomString() {
  var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const users = { maObO6:
  { id: 'maObO6',
    email: 'alex.xian@hotmail.com',
    password:
     '$2b$10$kIYkjl04kWyrDjfH4Xr6keftdUyt3JZyD/nJLhvMMdoiig/2B1NaG' },
 mthvQF:
  { id: 'mthvQF',
    email: 'test@test',
    password:
     '$2b$10$AU9d5QepBdji1KKxs2JSje6mNmfbqGvulamGx8UUMxDEZPlqV41b.' },
  aJ48lW:
  { id: 'aJ48lW',
    email: 'admin@admin',
    password:
     '$2b$10$pfdksQFmuC5vw1wxoZbnI.Q8zAgKuiOo/lOl2fY/EmYiPixzOH8YW' } }


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

app.get("/", (req, res) => {
  res.redirect("/urls")
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
    users, userID: req.session.user_id
    // ... any other vars
  };
   let statua = false;
   for (let name in users) {
     if (name === req.session.user_id) {
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
    users, userID: req.session.user_id
    // ... any other vars
  };
  res.send(`a = ${a}`);
 });

 app.get("/urls", (req, res) => {
   
  const templateVars = {
    users, userID: req.session.user_id, 
    // ... any other vars
    urls: urlsForUser(req.session.user_id)
  };
   
  res.render("urls_index", templateVars);
});     

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID){
    delete urlDatabase[req.params.shortURL];
  }

  res.redirect(`/urls`);
});

app.get("/login", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], users, userID: req.session.user_id };
  console.log(req.session.user_id)
  res.render('_login', templateVars)
});

app.post("/login", (req, res) => {
  let userN = req.body.email;
  let userP = req.body.password;
  if (req.body.email === '' && req.body.password === '') {
    res.status(400).end();
  }
  let statusP = false;
  let statusS = false;
  
  let userEMAIL = getUserByEmail(userN, users);

  if (bcrypt.compareSync(userP, users[userEMAIL].password)) {
    statusP = true;
  }
  if (userEMAIL){
    statusS = true;
  }
  if (statusS !== true || statusP !== true) {
    res.status(403).end();
  }
  req.session.user_id = userEMAIL;

  res.redirect('/urls')
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, userID: req.session.user_id };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, userID: req.session.user_id };
  console.log(templateVars)
  console.log(req.body)
  if (req.body.newURL) {
    let a = req.params.shortURL;
    urlDatabase[a].longURL = req.body.newURL;
    res.redirect(`/urls`)
  }
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  let URLA = req.params.shortURL
  res.redirect(urlDatabase[URLA].longURL);
});

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect('/urls')
});

app.get("/register", (req, res) => {
  const templateVars = {
    users, userID: req.session.user_id
    // ... any other vars
  };
  res.render("_register", templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);
  let latestURL = generateRandomString();
  urlDatabase[latestURL] = { longURL: req.body.longURL, userID: req.session.user_id};
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
  let hashedPW = bcrypt.hashSync(req.body.password, 10)
  users[latestUSER] = { id: latestUSER,
     email: req.body.email,
      password: hashedPW
  };
  req.session.user_id = latestUSER;
  console.log(users)
  res.redirect(`/urls`)
});