const { createPinia, defineStore, storeToRefs } = Pinia;
import {StytchUIClient} from 'https://cdn.jsdelivr.net/npm/@stytch/vanilla-js/+esm'

const pinia=createPinia();
 export  const useAuthStore= defineStore ('auth',{
    state:()=>({
        isLoggedIn:false,
        email:null,
        isLoding:false,
        token:null,
        stytch:null,
        error_message_not_pharmacist:"Role is not paramacist!",
        pharmacy:null

    }),
    actions:{
        async login(email,password,errorMessage) {
            this.stytch= new StytchUIClient('public-token-test-dbadb410-4f5c-4cd7-aad7-082ca96adfd5');
            try {
                errorMessage.value = '';
                const response = await this.stytch.passwords.authenticate({
                    email: email.value,
                    password: password.value,
                    session_duration_minutes: 60,
                });
                console.log("valore")
                console.log(response.user);
                const userRoles = response.user.roles;
                let isPharmacist = userRoles.includes('pharmacist');
                if(isPharmacist) {
                    this.email=email;
                    this.isLoggedIn=true;
                    this.token=response.session_jwt;
                    sessionStorage.setItem("pharmacy_id",response.user.trusted_metadata.pharmacy_id);
                      window.location.href = '/node_sever_pharmacist/node_sever_pharmacist/frontend/dashboard/dashboard.html';


                }else{
                    throw new Error(error_message_not_pharmacist);

                }
            } catch (error) {
                console.log(error);
                if(error.message === this.error_message_not_pharmacist){
                    errorMessage.value ='User Not Authorized';
                }else {
                    errorMessage.value = error.error_message || 'Login failed. Check your email and password.';
                }
                this.isLoading=false;
            }
        },
       async logout(){
            try{

                if(this.stytch){
                    await this.stytch.session.revoke();
                    sessionStorage.removeItem("pharmacy_id");
                }
            }catch (error){
                throw  new Error("Error");

            }
            this.email=null;
            this.token =null;
            this.isLoggedIn=false;
           this.isLoading = false;
        }
    }, getters: {
         isAuthenticated: (state) => state.isLoggedIn,
         userEmail: (state) => state.email,
         authToken: (state) => state.token,
         pharmacyId: (state) => state.pharmacy,
     }




});

