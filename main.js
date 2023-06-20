const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'loginformytvideo'
    }
})

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})
const btn = document.getElementById("btn");
const name = document.getElementById("name")
const email = document.getElementById("email");
const contactList = document.getElementById("contact-list");


btn.addEventListener("click", function (e) {
    e.preventDefault()
    isValid = form.checkValidity()
    if (isValid) {
        createContact()
        name.value = "";
        email.value = ""
    } else {
        console.log("write properly")
    }



})

function createContact() {
    const plate = document.createElement("div");
    plate.setAttribute("id", "contact");
    plate.innerHTML = ` <p id="nameDisplay">${name.value}</p>
    <p id="emaildisplay">${email.value}</p>
    <button id="delete" onclick="remove(this)">Delete</button>`
    contactList.appendChild(plate)

}

function remove(contact) {
    var element = contact;
    element.parentElement.remove()
}