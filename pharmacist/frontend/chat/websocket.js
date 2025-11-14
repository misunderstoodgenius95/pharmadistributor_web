import { ref, computed, readonly,watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';
export function  Websocket(){
    const wsurl=ref('ws://localhost:8081');
    const socket=ref(null);
    const  new_message=ref('');
    socket.value = new WebSocket(wsurl.value);
    socket.value.onopen=()=>{

    };
    socket.value.onmessage=async(event)=>{
        console.log("connected");
        new_message.value= event.data;
        console.log(event.data);





    };
    socket.value.onerror=(error)=>{
        console.log("error"+error.data);
    };
    socket.value.onclose = (event) => {
        console.log("WebSocket closed:", event.code);
    };




    return{
        new_message,socket
    }







}