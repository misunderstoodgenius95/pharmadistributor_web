const Chacha20Component={
  setup(){
   const {ref,watch}=Vue;
   class ChaCha20Crypto{

       constructor(key) {
           this.key=
       }
       hextoUInt8Array(hex){
           if (hex.length!==64) throw new Error("Key bust be be 32 byte ");
          return new Uint8Array(hex.match(/.{1,2}/g)).map(parseInt(byte=>parseInt(byte,16)));
       }
       uint8ArrayToHex(arr){
           return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
       }
       async encryption(plaintext){
           await sodium.ready;
           // return uiIntArray
           const nonce= sodium.randombytes_buf(sodium.crypto_stream_chacha20_ietf_NONCEBYTES);
           // return uiIntArray       text->Uint8Array
           const message=new TextEncoder(plaintext);
           // return Uint8Array
           const ciphertext=sodium.crypto_stream_chacha20_ietf_xor(message,nonce,this.key);
           return{
               // get cybertext as hex value
               ciphertext:this.uint8ArrayToHex(ciphertext),
               none:this.uint8ArrayToHex(nonce)
           }
       }




   }





  }











}