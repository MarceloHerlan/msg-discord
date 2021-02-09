import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import mongoData from './mongoData.js'
import Pusher from 'pusher'

//app config
const app=express()
const port=8002

const pusher = new Pusher({
  appId: "1133942",
  key: "572e230107d6ea2ff382",
  secret: "6e4e5ad11804d3a685ca",
  cluster: "eu",
  useTLS: true
});

//middlewares
app.use(express.json())
app.use(cors())

//db config
const mongoURI='mongodb+srv://lobo2:Redondos2@cluster0.kcqpt.mongodb.net/discordDB?retryWrites=true&w=majority'
mongoose.connect(mongoURI,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.once('open',()=>{
    console.log('DB connected')

    const changeStream=mongoose.connection.collection('conversations').watch()

    changeStream.on('change',(change)=>{
        if(change.operationType ==='insert'){
            pusher.trigger('channels','newChannel',{
                'change':change
            })
        }else if(change.operationType === 'update'){
            pusher.trigger('conversation','newMessage',{
                'change':change
            })
        }
        
        else{
            console.log('error triggering')
        }
    })
})

//api routes
app.get('/',(req,res)=>res.status(200).send('hello world'))

app.get('/get/channelList',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            let channels=[]

            data.map((channelData)=>{
                const channelInfo={
                    id:channelData._id,
                    name:channelData.channelName
                }
                channels.push(channelInfo)
            })
            res.status(200).send(channels)
        }
    })
})

app.get('get/data',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    }) 
})

app.get('/get/conversation',(req,res)=>{
    const id=req.query.id

    mongoData.find({_id:id},(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})
    

app.post('/new/channel',(req,res)=>{
    const dbData=req.body

    mongoData.create(dbData,(err,data)=>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.post('/new/message',(req,res)=>{
    
    const newMessage=req.body

    mongoData.update(
        {_id:req.query.id},
        {$push:{conversation:req.body}},
        (err,data)=>{
            if(err){
                console.log('error savig message...')
                console.log(err)

                res.status(500).semd(err)
            }else{
                res.status(201).send(data)
            }
        }
    )
})
//listen
app.listen(port,()=>console.log(`listening on localhost:${port}`))