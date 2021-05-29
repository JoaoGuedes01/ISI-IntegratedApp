let domain = "http://127.0.0.1:3000";

async function login() {
  let data = {
    email: document.getElementById("email_input").value,
    password: document.getElementById("password_input").value
  };
  console.log(data);

  const response = await fetch(`http://127.0.0.1:3000/user/login`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors',
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include'
  }).then(res => res.json())
    .then(data => {
      console.log(data);
      console.log(data.message)

      if(data.message === "Login Successful"){
        window.location.href = "/public/pilotos/index.html"
      }
    });    
}



async function changePassword() {
  let email = document.getElementById("email").value
  let data = {
    email: email
  };
  console.log(data);
  
  const response = await fetch(`http://127.0.0.1:3000/user/requestPasswordChange`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors',
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include'
  }).then(res => res.json())
    .then(data => {
      console.log(data);
      Swal.fire({
        title: "Alterar password",
        text: "Verifique o seu email",
        focusConfirm: false,
        preConfirm: async (event) => {
          window.location.href="/login"
        }
      })

      

    });
}