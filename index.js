const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

const port=8000;
app.listen(port,()=>{
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
app.get('/customers',(request,response)=>{
    response.send(customers);
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
app.post('/customers/add',(request,response)=>{
    console.log(request.body);
    let customerID=Math.floor(1000 + Math.random() * 9000);
    let temp={
        customerID:customerID,
        customerName:request.body.customerName,
        gender:request.body.gender,
        phoneNumber:request.body.phoneNumber,
    }
    customers.push(temp);
    response.send({customerID});
});
app.get('/customers/:customerID',(request,response)=>{
   for(let i=0;i<customers.length;i++){
       if(customers[i].customerID==request.params.customerID){
           response.send(customers[i]);
       }
   }
   response.send('Not Found');
});
app.post('/customers/delete',(request,response)=>{
    for(let i=0;i<customers.length;i++){
        if(customers[i].customerID===request.body.requestID){
            deletedCustomerIndex=i;
        }
    }
    let customersCopy=customers;
    customers=customers.filter((customer)=> customer.customerID!==request.body.customerID);
    customersCopy=customersCopy.filter((customer)=> customer.customerID===request.body.customerID);
    deletedCustomer=customersCopy[0];
    console.log("deleted customer is"+JSON.stringify(deletedCustomer));
    response.send({status:"deleted succesfuflly"});
});
app.post('/customers/undoDelete',(request,response)=>{
   // customers.push(deletedCustomer);
    customers.splice(deletedCustomerIDIndex,0,deletedCustomer);
   response.send({status:"undo successful"});

});