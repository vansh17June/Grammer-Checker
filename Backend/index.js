const express=require('express');
const  { GoogleGenerativeAI } =require('@google/generative-ai');
const dotenv=require('dotenv');
const cors = require('cors');

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
let count=1
app.get('/',(req,res)=>{
    res.send('Hello World');
});
app.post('/submit/CheckGrammer',async (req, res) => {
    console.log(count++)
  
    let {prompt} = req.body; // The data sent in the request body
    prompt+="\n"
    prompt+="Correct the grammar, sentence structure, and capitalization of the given text without adding extra words, changing the original meaning, or providing commentary.meaning of sentence should be same as given text.try to use same words used in text"
    const result = await model.generateContent(prompt);

    

    // Respond with a success message
    res.status(200).json({ message: 'Data received successfully', receivedData: result });
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})