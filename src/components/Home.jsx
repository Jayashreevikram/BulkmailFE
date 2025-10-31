import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Home = () => {
    const [msg,setmsg] =useState("")
    const [status,setstatus] =useState(false)
    const [emailList,setEmailList] =useState([])

    function handlemsg(eve)
    {
        setmsg(eve.target.value)
    }

    function send()
    {
        setstatus(true)
        axios.post("https://bulkmail-be.vercel.app/sendemail",{msg:msg,emailList:emailList})
        .then(function(data)
        {
            if(data.data === true) 
            {
                alert("Email sent successfully")
                setstatus(false)
            }
            else{
                alert("Failed")
            }
        })
    .catch(function(error){
      console.log("Error Sending Mail:",error)
      alert("server error")
    })
      }

    function handlefile(event)
    {
        const file=event.target.files[0]
    
         const reader =new FileReader()
         reader.onload=function(event){
        const data = new Uint8Array(event.target.result);
       const workbook = XLSX.read(data,{type:"array"})
       
        const SheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[SheetName];
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'});
        const totalemail=emailList.map(function(item){return item.A })
        console.log(totalemail)
        setEmailList(totalemail)
         }
    reader.readAsArrayBuffer(file) 
    }


  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1> 
      </div>
      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your business with sending multiple email at once</h1> 
      </div>
      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1> 
      </div>
      <div className="bg-blue-500 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter Email Text"></textarea>
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
      <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5 "></input>
   
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3"   >
      <p className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        Total Email in the file:{emailList.length}</p>
      <button onClick={send} 
      className="bg-blue-950 text-white py-2 px-2 font-medium rounded-md w-fit mt-8">{status?"sending...":"send"}</button>
    </div>
    </div>

  )}


export default Home
