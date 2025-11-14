import { createApp, ref, computed, nextTick, onMounted, onUnmounted,watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';
import{ useChaCha20} from './Chacha20.js';
import {Websocket} from './websocket.js';
import {SignedText} from './SignedText.js';
createApp({
 setup() {
     const{ encrypt,decrypt}=useChaCha20();
     const{new_message,socket}=Websocket();
     const{validateSHA256Signature}=SignedText();
    const isLoading = ref(true);
    const loginMessage=ref(false);
    const send_msg_text = ref('');
    const disabled_button=ref(true);
    const messages=ref([]);
    const newMessage=ref('');
    const seller=ref('');


socket.value.onopen=()=>{
    const data={
        userName:"pharmacist@example.com",
        messageType:'Starting',
        userType:'pharmacist'
    };
    socket.value.send(JSON.stringify(data));
    console.log("sent")

}// SEND MESSAGE
    const sendMessage = async (e) => {
        const encrypted = await encrypt(newMessage.value);
        const value = {
            from: "pharmacist@example.com",
            to: seller.value,
            type: "Chat",
            messages: encrypted
        }


        console.log(encrypted)
        messages.value.push({
            text: newMessage.value,
            timestamp: new Date()
        });
        socket.value.send(JSON.stringify(value));
    }



// INCOMING MESSAGE
     watch(new_message, async (value_chat) => {
            try {
                const data = JSON.parse(new_message.value);
                console.log(data.type);


                if (data.type == 'serverAuth') {
                    const validation =  await validateSHA256Signature(data.publicKey, data.message, data.signature);
                   if (validation){
                       console.log("true");



                   }else {
                       closeChat(e);
                   }

                }else if (data.type ==='Join'){
                    console.log("Joined with"+data.sellerFrom);
                    isLoading.value=false;
                    loginMessage.value=true;
                    disabled_button.value=false;
                    seller.value=data.From;


                }
                else if (data.type === "Chat"){
                  const text= await decrypt(data.Message)
                    console.log("text:   "+text)

                        messages.value.push({
                        text:"Venditore : "+text,
                        timestamp: new Date()
                    });
                }

            }catch (error){
                console.log("Json parse failed"+error);

            }

     });

    const closeChat = (e) => {
        console.log("Closing socket...");
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.close(1000, "Client closed connection"); // 1000 = normal closure
            console.log("Socket closed");


            window.location.href="/node_sever_pharmacist/node_sever_pharmacist/frontend/dashboard/dashboard.html";
        }

    }



  

    return {sendMessage, closeChat, isLoading, newMessage, send_msg_text,loginMessage,disabled_button,messages}
}




}).mount('#app');