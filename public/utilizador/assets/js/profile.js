let domain = "api"
let id_user_logged
let email_user_logged
let contacto
let Postal
let Cidade
let Morada

window.onload=() => {

    LoggedUser();

}


//get user logado
const LoggedUser = async () =>{

    const resposne = await fetch(`${domain}/user/loggedUser`, {
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
                email_user_logged=data.Email__c;
                contacto=data.Phone_Number__c;
                Postal=data.Postal_Code__c;
                Cidade=data.City__c;
                Morada=data.Address__c;
                renderDados();
            });
  }




  //get dados do user logado
  const renderDados = async () => {

    console.log(id_user_logged)

    const response = await fetch(`${domain}/user/${id_user_logged}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        method: 'GET',
        credentials: 'include'
    })
    const dados = await response.json()

    console.log(dados)



    //for(const dado of dados){
        document.getElementById("perfil").innerHTML +=`
        <div class="card-header">
            <strong class="card-title">${dados.First_Name__c} ${dados.Last_Name__c}</strong>
        </div>
        <div class="card-body">


        <strong> Informações pessoais </strong>
        <p> </p>
        <div class="row"><p style="padding-left:15px;padding-right:5px">Data de nascimento:</p> ${dados.Birth_Date__c}</div>
         <p> </p>
         <div class="row"><p style="padding-left:15px;padding-right:5px"> NIF:  </p> ${dados.NIF__c}</div>
        <hr>

        <strong> Contactos </strong>
        <p> </p>
        <div class="row"><p style="padding-left:15px;padding-right:5px">Email:</p> ${dados.Email__c} </div>
         <p> </p>
         <div class="row"><p style="padding-left:15px;padding-right:5px">Telemóvel: </p> ${dados.Phone_Number__c} </div>
        <hr>

        <strong> Morada </strong>
        <p> </p>
        <div class="row"><p style="padding-left:15px;padding-right:5px">Cidade:</p> ${dados.City__c}</div>
         <p> </p>
         <div class="row"><p style="padding-left:15px;padding-right:5px">Morada: </p> ${dados.Address__c} </div>
         <p> </p>
         <div class="row"><p style="padding-left:15px;padding-right:5px"> Código-Postal:</p>${dados.Postal_Code__c}</div>
        <hr>

        <strong> Identifier </strong>
        <p> </p> 
        <div class="row"><p style="padding-left:15px;padding-right:5px">Nº cartão cidadão:  </p>${dados.Identifier__c}</div>
         <p> </p>
         <div class="row"><p style="padding-left:15px;padding-right:5px">Nome: </p>${dados.Identifier_Name__c} </div>
        

        <!--
        
        dados.License_Number__c

        dados.Password__c-->




        </div>
    </div>`
  }



//alterar password
async function changePassword() {

    let data = {
        email: email_user_logged
      };
      console.log(data);
      
      const response = await fetch(`${domain}/user/requestPasswordChange`, {
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
            text: "Verifique o seu email"
          })

        });
}


async function showInfo(){


  const response = await fetch(`${domain}/user/${id_user_logged}`,{
    headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
    },
    method: 'GET',
    credentials: 'include'
})
const dados = await response.json()
document.getElementById("Editartelefone").value = dados.Phone_Number__c
document.getElementById("Editarmorada").value = dados.Address__c
document.getElementById("Editarcodigo").value = dados.Postal_Code__c
document.getElementById("Editarcidade").value = dados.City__c

}

async function alterarDados(){
    let contacto1 = document.getElementById("Editartelefone").value
    let morada = document.getElementById("Editarmorada").value
    let codigo = document.getElementById("Editarcodigo").value
    let cidade = document.getElementById("Editarcidade").value

    let data = {
        Id : id_user_logged,
        Phone_Number__c: contacto1,
        Postal_Code__c: codigo,
        Address__c: morada,
        City__c: cidade
    };


    console.log(data);
    
    const response = await fetch(`${domain}/user/updateLicense`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include'
    })   
  
     window.location.href="/public/utilizador/profile.html"

   

}








//COOCKIES
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function deleteCookie(name) { setCookie(name, '', -1); }
  
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }