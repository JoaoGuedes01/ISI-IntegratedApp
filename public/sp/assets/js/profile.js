let domain = "http://127.0.0.1:3000/api";

async function getLoggedUser() {
  const response = await fetch(domain+"/user/loggedUser", {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors',
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json())
    .then(data => {
      console.log(data);
    });


}