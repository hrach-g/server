const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');


let data = require('./source.json')
const app = express();
const port = 8080;



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get('/contact', function(req, res, next) {
  res.send(JSON.stringify(data, null, 2));
});


app.post('/contact',  function(req, res, next) {
  let  contact = new Contact(req.body.name, req.body.phone);
 	data.push(contact);

 	fs.writeFile('source.json', JSON.stringify(data) , (err)=>{
 		if (err) throw err;
 	})
 	res.send(JSON.stringify(data, null, 2));
});

app.put('/contact/:id' , (req, res, next) => {
	let id = req.params.id
	let elem = data.find((elem)=> {
		return id === elem.id
	})
	elem.name = req.body.name;
	elem.phone = req.body.phone;
	fs.writeFile('source.json', JSON.stringify(data) , (err)=>{
 		if (err) throw err;
 	})
 	res.send(JSON.stringify(data, null, 2));
})
app.delete('/contact/:id' , (req, res, next) => {
	let id = req.params.id
	console.log(id);
	data.find((elem, index)=> {
		if (elem.id === id) {
			return data.splice(index, 1 );
		}
	})
	fs.writeFile('source.json', JSON.stringify(data) , (err)=>{
 		if (err) throw err;
 	})
	res.send(JSON.stringify(data, null, 2));
})

app.listen(port, ()=>{
	console.log(`server created in ${port} port`)
})




class Contact {
  constructor(name, phone) {
    this.id = Guid.createGUID();
    this.name = name;
    this.phone = phone;
  }
}

class Guid {
    static guid4() {
        return Math.random().toString(16).substr(2, 4);
    }

    static createGUID () {
            return Guid.guid4() + Guid.guid4() + '-' + Guid.guid4() + '-' + Guid.guid4() + '-' + Guid.guid4() + '-' + Guid.guid4() + Guid.guid4() + Guid.guid4();
    }
}