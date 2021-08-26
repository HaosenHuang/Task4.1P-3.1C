const express = require("express")
const app = express()
const { response } = require("express")
const https = require("https")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Accounts",{useNewUrlParser:true})
var validator = require('validator')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.listen(8080, function(request, response){
    console.log("on port 8080")
})

const accountSchema = new mongoose.Schema(
    {
    country:{type: String, required: true},
    firstname:{type: String, required: true},
    lastname:{type: String, required: true},
    email:{type: String, required: true, validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Email is not valid!')
        }
    }},
    passward:{type: String, required: true, minlength: 8},
    confirm:{type: String, required: true, minlength: 8,validate(value){
        if(!validator.equals(value, passward)){
            throw new Error('Passward is not the same!')
        }
    }},
    address:{type: String, required: true},
    city:{type: String, required: true},
    state:{type: String, required: true},
    code: {type:String},
    number: {type:String}
    }
)
const Account = mongoose.model('Account', accountSchema)
app.post('/',(req,res)=>{
    const getCountry = req.body.country
    const getFisrtname = req.body.firstname
    const getLastname = req.body.lastname
    const getEmail = req.body.email
    const getPassward = req.body.passward
    const getConfirm = req.body.checkpassward
    const getAddress = req.body.address
    const getCity =req.body.city
    const getState = req.body.state
    const getCode = req.body.code
    const getNumber = req.body.number
    const account1 = new Account(
        {
            country : getCountry,
            firstName : getFisrtname,
            lastName : getLastname,
            email : getEmail,
            passward : getPassward,
            confirm : getConfirm,
            address : getAddress,
            city : getCity,
            state : getState,
            code : getCode,
            number : getNumber
     })
     account1.save((err)=>{
        if(err)
        {console.log(err)}
        else
        {console.log("create successful!")}
    })
    const data = {
        members:[{
            email_address: req.body.email,
            status: "subscribed",
            merge_fields:{
                FNAME: req.body.firstname,
                LNAME: req.body.lastname
            }
        }]
    }
    jsonData = JSON.stringify(data)
    const url = "https://us5.api.mailchimp.com/3.0/lists/7eb83e8e93"
    const options ={
        method:"POST",
        auth:"haosenhuang:a892d930489106fe727ac25ffec3c847-us5"
    }
    const request = https.request(url, options, (response)=>{
        response.on("data", (data)=>{
            console.log(JSON.parse(data))
        })
    })
    
    request.write(jsonData)
    request.end()
    
})
app.post('/', (req,res)=>
{
    res.send("successful!")
})