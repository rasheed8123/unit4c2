const express = require("express")
const mongoose = require("mongoose")

const app = express();

const connect = () =>{
    return mongoose.connect("mongodb://127.0.0.1:27017/unit4c2")
}
const UserSchema = new mongoose.Schema({
    firstName : {type:String,required:true},
    middleName : {type:String,required:false},
    lastName : {type:String,required:true},
    age : {type:Number,required:true},
    email : {type:String,required:true},
    address : {type:String,required:true},
    gender :{type:String, default:"Female"},
    type : {type:String, default:"customer"},

},
{
    timestamps:true
})
const user = mongoose.model("user",UserSchema)

const BranchDetails = new mongoose.Schema({
    name :{type:String,required:true},
    address: {type:String,required:true},
    IFSC : {type:String,required:true},
    MICR : {type:Number,required:true}
},
{
    timestamps:true
})
const branch = mongoose.model("branch",BranchDetails)

const MasterAccount = new mongoose.Schema({
    balance :{type:Number,required:true},
    userid : {type:mongoose.Schema.Types.ObjectId,
    ref: "user",
    required:true},
    branchdetails : {type:mongoose.Schema.Types.ObjectId,
        ref: "branch",
        required:true}
},
{
    timestamps:true
})
const masteraccount = mongoose.model("masteraccount",MasterAccount)
const SavingsAccount = new mongoose.Schema({
     account_number:{type:Number,required:true,unique:true},
     balance:{type:Number,required:true},
     interestRate:{type:Number,required:true},
     userid : {type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true},
        masteraccount : {type:mongoose.Schema.Types.ObjectId,
            ref: "masteraccount",
            required:true}
 },
 {
     timestamp:true
 })
const savingaccount = mongoose.model("savingaccount",SavingsAccount)
const FixedAccount = new mongoose.Schema({
    account_number :{type:Number,required:true,unique:true},
    balance: {type:Number,required:true},
    interestRate :{type:Number,required:true},
    startDate: {type:String,required:true},
    maturityDate:{type:String,required:true},
    userid : {type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true},
        masteraccount : {type:mongoose.Schema.Types.ObjectId,
            ref: "masteraccount",
            required:true}

},{
    timestamps:true
})
const fixedaccount = mongoose.model("fixedaccount",FixedAccount)

app.get("/:id",async(req,res)=>{
    try{
        const data = await masteraccount.find({_id:req.params.id}).populate({
         path :"userid"
        }).lean().exec()
        return res.status(200).send(data)
    }
    catch(err){
        console.log(err.message)
        return res.send(err.message)
    }
})
app.post("/savingaccount",async(req,res)=>{
try{
const data = await savingaccount.create(req.body)
saving = data.balance 
masteraccount.find({masteraccount:data.masteraccount},{set:{balance:balance+saving}})
return res.status(201).send(data)
}
catch(err){
    console.log(err.message)
    return res.send(err.message)
}
})
app.get("/:id",async(req,res)=>{
    try{
        const data = await masteraccount.find({_id:req.params.id}).populate({
         path :"userid"
        }).lean().exec()
        return res.status(200).send(data)
    }
    catch(err){
        console.log(err.message)
        return res.send(err.message)
    }
})

app.post("/fixedaccount",async(req,res)=>{
try{
const data = await fixedaccount.create(req.body)
fixed = data.balance 
masteraccount.find({masteraccount:data.masteraccount},{set:{balance:balance+fixed}})
return res.status(201).send(data)
}
catch(err){
    console.log(err.message)
    return res.send(err.message)
}
})

app.get("/:id",async(req,res)=>{
try{

}catch(err){
    console.log(err.message)
}
})








app.listen(5000,async()=>{
    try{
        await connect();
    }
    catch(err){
        console.log(err.message)
    }
    console.log("listeneing")
})