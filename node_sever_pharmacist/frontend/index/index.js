const { createApp, ref, onMounted,watch,computed } = Vue;
const { createPinia, defineStore, storeToRefs } = Pinia;
import {StytchUIClient} from 'https://cdn.jsdelivr.net/npm/@stytch/vanilla-js/+esm'
import { useAuthStore } from '../pinia/pinia.js ';
const pinia = createPinia();





    const app = createApp({
        setup() {
            const email = ref('');
            const password = ref('');
            const isLoggedIn = ref(false);
            const userEmail = ref('');
            const errorMail=ref('');
            const  errorPassword=ref('');
            const errorMessage = ref('');
            const  isSubmitted=ref(false);
            const stytch = ref(null);
            const authStore = useAuthStore();
            const regex_password=/(?=.*[A-Z])*(?=.*[a-z])(?=.*\d)(?=.*\W).{11,}/;
            const regex_email=/^[\w]+[\.]*[-]*[\w]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            const isEmailValid = computed(() => {
                return email.value.length > 0 && regex_email.test(email.value);
            });

            const isPasswordValid = computed(() => {
                return password.value.length > 0 && regex_password.test(password.value);
            });
            const isFormValid = computed(() => {
                return isEmailValid.value && isPasswordValid.value;
            });
            const isButtonDisabled = computed(() => {
                return !isFormValid.value || isSubmitted.value;
            });


            const validateEmail=()=>{

                if (!regex_email.test(email.value)){
                    errorMail.value="Email non valida";
                    return false;
                    console.log("email non validaaa")
                }else {
                    errorMail.value="";
                    console.log("email valida");
                    return true;
                }
               

            }
            const validatePassword=()=>{
                if (!regex_password.test(password.value)){
                    errorPassword.value="Password non valida";
                    return false;
                }else {
                    errorPassword.value="";
                    return true;
                }
       
            }
            const handleSubmit= async (e)=>{
                console.log("send")
              e.preventDefault();
                if (validateEmail() && validatePassword()){
                    isSubmitted.value=true;
                     authStore.login(email,password,errorMessage );

                }else{
                    isSubmitted.value=false;
                }





            }
            const send= async()=>{
                console.log("working")

            };




            onMounted(() => {


                // Initialize Stytch with your public token (replace with yours)
               /* stytch.value = new StytchUIClient('public-token-test-dbadb410-4f5c-4cd7-aad7-082ca96adfd5');

                // Check for existing session on page load
                const sessionJwt = localStorage.getItem('stytch_session_jwt');
                if (sessionJwt) {
                    stytch.value.session.get()
                        .then((session) => {
                            if (session.authenticated) {
                                isLoggedIn.value = true;
                                userEmail.value = session.user.emails[0]?.email || 'User';
                            }
                        })
                        .catch(() => localStorage.removeItem('stytch_session_jwt'));
                }*/
            });
            let error_message_not_pharmacist="Role is not paramacist!";




            const logout = () => {
                stytch.value.session.revoke()
                    .then(() => {
                        isLoggedIn.value = false;
                        userEmail.value = '';
                        localStorage.removeItem('stytch_session_jwt');
                    })
                    .catch((error) => {
                        errorMessage.value = 'Logout failed: ' + error.message;
                    });
            };

            return { email, password,  isButtonDisabled, isLoggedIn,send, userEmail,validateEmail,validatePassword,handleSubmit,isSubmitted, errorMessage , errorMail,errorPassword };
        },
    });
    app.use(pinia);
    app.mount('#app');

