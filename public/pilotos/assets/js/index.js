//utilizador logado
let id_user_logged

window.onload=() => {

    LoggedUser();
console.log(id_user_logged)
}



//get user logado
const LoggedUser = async () =>{

    console.log("ola")

    const resposne = await fetch('http://127.0.0.1:3000/user/loggedUser', {
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        method: 'GET',
        credentials: 'include'
    }).then(res => res.json())
            .then(data => {
                console.log(data)
                id_user_logged =data.Id;
                console.log(id_user_logged)
            });
            
 

}