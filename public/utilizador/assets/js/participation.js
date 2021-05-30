let id_user_logged
let domain = "http://127.0.0.1:3000/api"

window.onload=() => {

    let cards_eventos = document.getElementById("cards_eventos");  

    
    renderEventos();
    LoggedUser();
}


//renderEventos
const renderEventos = async () => {    //colocar resultados
      
    const response = await fetch(`${domain}/user/events`) 
    const eventos = await response.json()
    let i = 1
    let nome_evento
    for (const evento of eventos) {
        console.log(eventos)
        nome_evento = evento.EventName__c;
        console.log(nome_evento)
        i++
  
    //verificar data
    var today = new Date();
  
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    today = yyyy + '-' + mm + '-' + dd;
  
    console.log(today)
    console.log(evento.StartDate__c)
  
    if(evento.StartDate__c < today){   //só aparecem eventos depois de hoje
  
        //verificar se já está inscrito
        const response = await fetch(`${domain}/user/registrationByEventID/${evento.Id}`) 
        const inscritos = await response.json()
  
        for (const inscrito of inscritos) {
         // console.log("entrou")
          console.log("id do inscrito" + inscrito.PilotID__c)
  
          console.log(id_user_logged)
  
          if(inscrito.PilotID__c == id_user_logged){  //Se estiver inscrito o botão diz inscrito e já não se pode inscrever novamente
            console.log("Já está inscrito")
  
            const response2 = await fetch(`${domain}/admin/trackById/${evento.Track__c}`) 
            const pistas = await response2.json()
            for(const pista of pistas){

                const nome_pista = pista.TrackName__c
                document.getElementById("cards_eventos").innerHTML += `
    
                <div class="col-md-4">
                <div class="card">
                <div class="card-header">
                <strong>${evento.EventName__c}</strong>
                </div>
          
                <div class="card-body">
                  <p>Desde: ${evento.StartDate__c}</p>
                  <p>Até: ${evento.CloseDate__c}</p>
                  <p>Tipo: ${evento.EventType__c}</p>
                  <p>Preço: ${evento.InscPrice__c}€</p>
                  <p>Pista: ${nome_pista}</p>
                  <p> <span class="badge badge-info" name=""> Participou </span></a>
                  </p>
                </div>
                </div>   
                  `        
         }

          }
          i++
      }
  
  
  
    }
  }
  
  } 




//get user logado
const LoggedUser = async () =>{

    //console.log("ola")
  
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
  
                console.log(id_user_logged)
            });
  }