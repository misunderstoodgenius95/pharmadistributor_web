const{createApp,ref, onMounted}=Vue;
createApp({
  setup(){
      const container=ref('');


      function redictToLogin() {

          localStorage.removeItem('stytch_session_jwt')
          window.location.href='/untitled/index/index.html';
      }
      onMounted(()=>{
          console.log("Mounted");

          checkSession();
      });
      async function getMenu(event) {
          let element = event.target;
          let href = element.attributes.href.value.split('#')[1];
          let url='';
          if (href === "order") {
              url='http://localhost:3000/order'

          }else{
              url='http://localhost:3000/offer'
          }
          container.value = await fetch(url);


      }

      const checkSession= async ()  => {
          try {
              const token = localStorage.getItem('stytch_session_jwt');
              if (!token) {
                  redictToLogin();
                  return;

              } else {
                  const response = await fetch('https://localhost:3000/dashboard',
                      {headers: {'Authorization': 'Bearer ' + jwt}})
                  if (!response.ok){
                      redictToLogin();
                  }
                  console.log(response)

              }
          }catch (error){
           //   redictToLogin();
          }
          console.log("Success");


      }
      return{
          getMenu,container
      }










  }
}).mount('#app');