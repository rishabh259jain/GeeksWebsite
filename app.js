const express = require('express');
const path = require('path');
const app = express();

const hostname = 'localhost';
const port = 80;

app.use('/static',express.static('static')); // setup for getting static files
app.use(express.urlencoded()); //for getting form data automatically using post method using express when we press submit button

app.set('view engine','pug'); // setting up our template engine as pug
app.set('views',path.join(__dirname,'view')); // set the view directory

// connecting to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contactGeeks', {useNewUrlParser: true,  useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we are connected now!!");
});

const contactUsSchema = new mongoose.Schema({
    name: String,
    age: Number,
    query: String
});
contactUsSchema.methods.printAll = function () {
    const fullInfo =   `Customer name is: ${this.name}\nCustomer age is: ${this.age}\nCustomer query is: ${this.query}`;
    console.log(fullInfo);
}

const seeker = mongoose.model('contact', contactUsSchema); //making a collection named as contacts


// silence.speak();

// ENDPOINTS:

// rendering pug template engine
app.get('/',(req,res)=>{
    res.status(200).render('index.pug',{title:"RJIT GEEKS"});
});
app.get('/contact',(req,res)=>{
    res.status(200).render('contact.pug',{title:"Contact Us", message:"Please fill out this form to contact us"});
});
app.post('/contact',(req,res)=>{
    const Data = new seeker(req.body);
    Data.save(function (err, Data) {
        if (err) return console.error(err);
        Data.printAll();
    });
    res.status(200).render('contact.pug',{title:"Thank You",message: "thank you for filling out the form"});
});

// start the server
app.listen(port,hostname,()=>{
    console.log(`this application started successfully on the port ${port}`);
})