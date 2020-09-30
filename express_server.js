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


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});

 app.get("/fetch", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.send(`a = ${a}`);
 });

 app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
    urls: urlDatabase
  };
   
  res.render("urls_index", templateVars);
});     

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  let useR = req.body.username;
  console.log(useR)
  res.cookie("username", useR)
  // res.redirect(`/urls`);
  
  res.redirect('/urls')
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"], };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"], };
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
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect('/urls')
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let latestURL = generateRandomString();
  urlDatabase[latestURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${latestURL}`)
});