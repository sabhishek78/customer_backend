const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url="mongodb+srv://sabhishek78:OsmN@1978@cluster0-gkfgf.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = 'customer-application';
let mongoConnection=null;
const bcrypt = require('bcrypt');
const saltRounds = 10;
var cookieSession = require('cookie-session');



// MongoClient.connect(url, function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
//
//     const db = client.db(dbName);
//
//     client.close();
// });
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(cookieSession({
    name: 'session',
    secret:'xyz',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials","true");
    next();
});

const port=8000;
app.listen(port,async()=>{
    mongoConnection= await MongoClient.connect(url);
    console.log(`server is running on port ${port}`);
});
let customer={
    customerName:'abhishek',
    phoneNumber:'9713219321',
    gender:'Male',
    customerID:4125,
}
let deletedCustomer={
    customerName:"",
    phoneNumber:"",
    gender:"",
    customerID:"",
}
let deletedCustomerIndex;
let customers=[customer];
app.get('/',(request,response)=>{
 console.log(request.body);
 response.send('Hey There')
});
app.get('/customers',async(request,response)=>{
    let data=await mongoConnection.db('customer-application').collection('customers').find({status:"active"}).toArray();
    console.log("the data is ="+JSON.stringify(data));
    response.send(data);
})

// app.get('/customers/add',(request,response)=>{
//     let newCustomer={
//         customerName:'av'+Math.floor(Math.random()*10000),
//         phoneNumber:Math.floor(Math.random()*10000).toString(),
//         gender:'Male',
//         customerID:Math.floor(Math.random()*10000),
//     }
//     customers.push(newCustomer);
//     response.send(customers);
// });
app.post('/customers/add',async(request,response)=>{
    console.log(request.body);
    // let customerID=Math.floor(1000 + Math.random() * 9000);
    let temp={
        // customerID:customerID,
        customerName:request.body.customerName,
        gender:request.body.gender,
        phoneNumber:request.body.phoneNumber,
        status:"active"
    }
    // customers.push(temp);
    let result=await mongoConnection.db('customer-application').collection('customers').insertOne(temp);
    console.log("result is ="+result.insertedId);
    response.send(result.insertedId);
});
app.post('/users/signUp',async(request,response)=>{
    console.log(request.body);
    // let customerID=Math.floor(1000 + Math.random() * 9000);
    var hashedPassword=await bcrypt.hash(request.body.password, saltRounds);
    let temp={
        // customerID:customerID,
        customerName:request.body.customerName,
        password:hashedPassword,
    }
    // customers.push(temp);
    let findUser=await mongoConnection.db('customer-application').collection('users').findOne({"customerName":request.body.customerName});
    console.log("find User="+findUser);
    if(findUser===null){
        let result=await mongoConnection.db('customer-application').collection('users').insertOne(temp);
        console.log("result is ="+result.insertedId);
        request.session.userID=result.insertedId;
        response.send(result.insertedId);
    }
    else{
        console.log("user exists");
        response.send({status:"exists"});
    }
});
app.post('/users/login',async(request,response)=>{
    console.log(request.body);
    let user=await mongoConnection.db('customer-application').collection('users').findOne({"customerName":request.body.customerName});
    console.log("user=");
    console.log(user);
    if(user===null){
        console.log("user not present in database");
        response.send({status:"userDoesNotExist"});
    }
    if(user!==null){
        console.log("user exists checking for password");
        var result=await bcrypt.compare(request.body.password,user.password);
        if(result){
            response.send({status:"passwordsMatch"});
        }
        else{
            response.send({status:"passwordsDoNotMatch"});
        }
    }

});
app.get('/customers/:customerID',(request,response)=>{
   for(let i=0;i<customers.length;i++){
       if(customers[i].customerID==request.params.customerID){
           response.send(customers[i]);
       }
   }
   response.send('Not Found');
});
app.post('/customers/delete',async(request,response)=>{
    console.log("Inside delete");
    console.log(request.body);
    // let status=db.people.findAndModify( {
    //     query: { name: "Tom", state: "active", rating: { $gt: 10 } },
    //     sort: { rating: 1 },
    //     update: { $inc: { score: 1 } }
    // } );
    let status=await mongoConnection.db('customer-application').collection('customers').updateOne( { '_id': request.body.customerID, "status" : "deleted" });
    console.log(status);
    response.send("status after removal from mongo db="+status);
    // for(let i=0;i<customers.length;i++){
    //     if(customers[i].customerID===request.body.requestID){
    //         deletedCustomerIndex=i;
    //     }
    // }
    // let customersCopy=customers;
    // customers=customers.filter((customer)=> customer.customerID!==request.body.customerID);
    // customersCopy=customersCopy.filter((customer)=> customer.customerID===request.body.customerID);
    // deletedCustomer=customersCopy[0];
    // console.log("deleted customer is"+JSON.stringify(deletedCustomer));
    // response.send({status:"deleted succesfuflly"});
});
app.post('/customers/undoDelete',(request,response)=>{
   // customers.push(deletedCustomer);
    customers.splice(deletedCustomerIDIndex,0,deletedCustomer);
   response.send({status:"undo successful"});

});

