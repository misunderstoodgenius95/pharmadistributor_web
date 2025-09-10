import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// Dynamically import Stytch SDK
import('https://cdn.jsdelivr.net/npm/@stytch/vanilla-js/+esm').then(({ StytchUIClient }) => {
    const app = createApp({
        setup() {
            const email = ref('');
            const password = ref('');
            const isLoggedIn = ref(false);
            const userEmail = ref('');
            const errorMessage = ref('');
            const stytch = ref(null);

            onMounted(() => {
                // Initialize Stytch with your public token (replace with yours)
                stytch.value = new StytchUIClient('public-token-test-dbadb410-4f5c-4cd7-aad7-082ca96adfd5');

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
                }
            });
            let error_message_not_pharmacist="Role is not paramacist!";
            const login = async () => {
                try {
                    errorMessage.value = '';
                    const response = await stytch.value.passwords.authenticate({
                        email: email.value,
                        password: password.value,
                        session_duration_minutes: 60,
                    });
                    console.log(response.user.roles);
                    const userRoles = response.user.roles;
                    let isPharmacist = userRoles.includes('pharmacist');
                    if(isPharmacist) {

                        //showDashboard.value = true;


                        localStorage.setItem('stytch_session_jwt', response.session_jwt);
                        errorMessage.value = 'Login successful!';


                        // fetch immediato
                       window.location.href = '/untitled/dashboard/dashboard.html';

                        email.value = '';
                        password.value = '';

                    }else{
                        throw new Error(error_message_not_pharmacist);

                    }
                } catch (error) {
                    console.log(error);
                    if(error.message === error_message_not_pharmacist){
                        errorMessage.value ='User Not Authorized';
                    }else {
                        errorMessage.value = error.error_message || 'Login failed. Check your email and password.';
                    }
                }
            };

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

            return { email, password, isLoggedIn, userEmail, errorMessage, login, logout };
        },
    });
    app.mount('#app');
});
