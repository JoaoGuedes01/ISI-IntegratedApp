let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
let id_user_logged

let id_evento


let pista


window.onload = () => {

  let cards_eventos = document.getElementById("cards_eventos");


  renderEventos();
  LoggedUser();


}

//renderEventos
const renderEventos = async () => { //falta confirmar a licença

  const response = await fetch(`${domain}/user/events`)
  const eventos = await response.json()
  let i = 1
  //console.log(eventos.userRegs.length);
  //console.log(eventos.notRegs.length);


  if (eventos.userRegs.length > 0) {
    for (i = 0; i < eventos.userRegs.length; i++) {
      const userRegEvent = await fetch(`${domain}/user/eventById/` + eventos.userRegs[i]);
      const userEv = await userRegEvent.json();
      //console.log(userEv);
      if (userEv[0].EventStatus__c == 'cancelado') {
        document.getElementById("cards_eventos").innerHTML +=
          `
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <strong>${userEv[0].EventName__c}</strong>
          </div>

          <div class="card-body">
            <p>Desde: ${userEv[0].StartDate__c}</p>
            <p>Até: ${userEv[0].CloseDate__c}</p>
            <p>Tipo: ${userEv[0].EventType__c}</p>
            <p>Preço: ${userEv[0].InscPrice__c}€</p>
            <p>Pista: <a class="map" id="pistaaa" value='${userEv[0].Track__c}' onmousemove="changeStyle(this)" onmouseleave="changeStylee(this)">Ver localização</a></p>
            <p> <span class="badge badge-info" name=""> Cancelado </span></a>
    </p>

        </div>
      </div>
    `
      } else {
        document.getElementById("cards_eventos").innerHTML +=
          `
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <strong>${userEv[0].EventName__c}</strong>
          </div>

          <div class="card-body">
            <p>Desde: ${userEv[0].StartDate__c}</p>
            <p>Até: ${userEv[0].CloseDate__c}</p>
            <p>Tipo: ${userEv[0].EventType__c}</p>
            <p>Preço: ${userEv[0].InscPrice__c}€</p>
            <p>Pista: <a class="map" id="pistaaa" value='${userEv[0].Track__c}' onmousemove="changeStyle(this)" onmouseleave="changeStylee(this)">Ver localização</a></p>
            <p> <span class="badge badge-info" name=""> Inscrito </span></a>
    </p>

        </div>
      </div>
    `
      }
    }
  }

  if (eventos.notRegs.length > 0) {
    //console.log('entrou')
    for (i = 0; i < eventos.notRegs.length; i++) {
      //console.log('aquy')
      const userNotRegEvent = await fetch(`${domain}/user/eventById/` + eventos.notRegs[i]);
      const userEv = await userNotRegEvent.json();
      //console.log(userEv);
      if (userEv[0].EventStatus__c == 'espera_conf') {
        document.getElementById("cards_eventos").innerHTML +=
          `
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <strong>${userEv[0].EventName__c}</strong>
            </div>
  
            <div class="card-body">
              <p>Desde: ${userEv[0].StartDate__c}</p>
              <p>Até: ${userEv[0].CloseDate__c}</p>
              <p>Tipo: ${userEv[0].EventType__c}</p>
              <p>Preço: ${userEv[0].InscPrice__c}€</p>
              <p>Pista: <a class="map" id="pistaaa" value='${userEv[0].Track__c}' onmousemove="changeStyle(this)" onmouseleave="changeStylee(this)">Ver localização</a></p>
              <p> <span class="badge badge-warning" name=""> Brevemente </span></a>
  
   
    </p>
          </div>
        </div>
      `
      } else if (userEv[0].EventStatus__c == 'cancelado') {
        document.getElementById("cards_eventos").innerHTML +=
          `
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <strong>${userEv[0].EventName__c}</strong>
            </div>
  
            <div class="card-body">
              <p>Desde: ${userEv[0].StartDate__c}</p>
              <p>Até: ${userEv[0].CloseDate__c}</p>
              <p>Tipo: ${userEv[0].EventType__c}</p>
              <p>Preço: ${userEv[0].InscPrice__c}€</p>
              <p>Pista: <a class="map" id="pistaaa" value='${userEv[0].Track__c}' onmousemove="changeStyle(this)" onmouseleave="changeStylee(this)">Ver localização</a></p>
              <p> <span class="badge badge-warning" name=""> Cancelado </span></a>
  
   
    </p>
          </div>
        </div>
      `
      } else {
        document.getElementById("cards_eventos").innerHTML +=
          `
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <strong>${userEv[0].EventName__c}</strong>
          </div>

          <div class="card-body">
            <p>Desde: ${userEv[0].StartDate__c}</p>
            <p>Até: ${userEv[0].CloseDate__c}</p>
            <p>Tipo: ${userEv[0].EventType__c}</p>
            <p>Preço: ${userEv[0].InscPrice__c}€</p>
            <p>Pista: <a class="map" id="pistaaa" value='${userEv[0].Track__c}' onmousemove="changeStyle(this)" onmouseleave="changeStylee(this)">Ver localização</a></p>
            <p> <button value='${userEv[0].Id}' class="btn btn-success inscrever" name="increver"> Participar </button></p>

 
  </p>
        </div>
      </div>
    `
      }
    }
  }




  //ver mapa

  const btnMapa = document.getElementsByClassName("map")

  for (let i = 0; i < btnMapa.length; i++) {
    //console.log(i)
    //console.log("entrou")
    btnMapa[i].addEventListener("click", async (event) => {


      id_pista = btnMapa[i].getAttribute("value");

      const response2 = await fetch(`${domain}/admin/trackById/${id_pista}`)
      const pistas = await response2.json()

      let latitude = pistas.track.MapsLat__c
      let longitude = pistas.track.MapsLong__c
      let name = pistas.track.TrackName__c

      //console.log(name + " " + latitude)

      Swal.fire({
        title: name,
        html: `  <div id="mapa"> </div>`
      })

      var coordenadas = { lat: latitude, lng: longitude };


      var mapa = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 15,
        center: coordenadas
      });

      var marker = new google.maps.Marker({
        position: coordenadas,
        map: mapa,
        title: 'Meu marcador'
      });

    })
  }



  //botão participar
  const btnParticipar = document.getElementsByClassName("inscrever")
  for (let i = 0; i < btnParticipar.length; i++) {
    btnParticipar[i].addEventListener("click", async (event) => {

      //get id trofeu selecionado
      id_evento = btnParticipar[i].getAttribute("value");
      //console.log("O evento selecionado é: " + id_evento)
      //console.log("O piloto logado é: " + id_user_logged)

      await Swal.fire({

        title: 'Inscrição no evento',
        html:
          `<br>

              <form id="formRegistoEvento">
              <div class="form-group row">		 
             
        
             <div class="col-md-12" >
                  <div class="row">
                  <div class="col-md-12">
                    <strong> Dados do carro </strong>
                </div>
                </div>


                 <div class="row">
                     <div class="col-md-6"><label for="nome_carro" class=" form-control-label">Carro</label>
                     <input type="text" id="carro" placeholder="Nome do carro" class="form-control" required> </div>   
                     <div class="col-md-6"><label for="motor_carro" class=" form-control-label">Motor </label>
                     <input type="text" id="motor" placeholder="Motor do carro" class="form-control" required> </div>  
                  </div>
        
                  <br>

        
                  <div class="row">
                  <div class="col-md-6"><label for="transponder_carro" class=" form-control-label">Transponder </label>
                  <input type="text" id="transponder" placeholder="Transponder do carro" class="form-control" required> </div> 
                  <div class="col-md-6"><label for="radio_carro" class=" form-control-label">Radio </label>
                  <input type="text" id="radio" placeholder="Radio do carro" class="form-control" required> </div>     
               </div>
      
        
            <br>
            <br>

            <div class="col-md-12" >
            <div class="row">
            <div class="col-md-12">
              <strong> Dados do mecânico </strong>
          </div>
          </div>



         <div class="row">
         <div class="col-md-12"><label for="nome_mecanico" class=" form-control-label" >Nome</label>
         <input type="text" id="nome_mec" placeholder="Nome do mecânico" class="form-control" required> </div>   
        </div>
        
        <br>
        
        
        <div class="row">
        <div class="col-md-6"><label for="email_mecanico" class=" form-control-label">Email</label>
        <input type="text" id="email_mec" placeholder="Email do mecânico" class="form-control" required> </div>  
        <div class="col-md-6"><label for="telefone_mecanico" class=" form-control-label">Contacto</label>
        <input type="text" id="tel_mec" placeholder="Contacto do mecânico" class="form-control" required> </div>    
        </div>
        
        <br>
        <br>
        <div class="col-md-12" >
        <div class="row">
        <div class="col-md-12">
          <strong> Mesa</strong>
      </div>
      </div>
                  <div class="row"> 
                  <div class="col-md-3"></div> 
                     <div class="col-md-6">
                         <select name="select" id="mesa" class="form-control"  onmousedown="getMesas()"required>
                             <option value="0" name="select" id="0">Selecione</option>
                         </select>
                     </div>        
        
                 </div>
                 </div>
                  <br>      
             <hr>
             
        
           </div>
           
             </form>`,







        focusConfirm: false,
        preConfirm: async (event) => {
          //return [

          //event.preventDefault()

          let data = {
            PilotCar__c: document.getElementById('carro').value,
            CarMotor__c: document.getElementById('motor').value,
            CarTransponder__c: document.getElementById('transponder').value,
            Radio__c: document.getElementById('radio').value,
            MechanicName__c: document.getElementById('nome_mec').value,
            MechanicEmail__c: document.getElementById('email_mec').value,
            MechanicPhone__c: document.getElementById('tel_mec').value,
            Table__c: document.getElementById('mesa').value,
            EventID__c: id_evento
          };

          //console.log(data)

          // Registar no evento
          let response
          response = await fetch(`${domain}/user/registerInEvent`, {
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

              //console.log(data);
              if (data.status == 500) {
                Swal.fire({
                  title: "Erro",
                  text: "Precisa de uma licença nacional"
                })
              }
              else {
                //console.log(data)
                window.open(data.forwardLink)
              }
              //window.location.href="/public/utilizador/events.html"

            });
        }


      })


    })
  }

}


//get user logado
const LoggedUser = async () => {

  ////console.log("ola")

  const resposne = await fetch(`${domain}/user/loggedUser`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json())
    .then(data => {
      id_user_logged = data.Id;
    });
}



//Mostrar mesas


async function getMesas() {
  let Mesas = document.getElementById("mesa")
  ////console.log("entrei no select mesas")

  const response = await fetch(`${domain}/user/eventById/${id_evento}`)
  const evento = await response.json()



  const response5 = await fetch(`${domain}/admin/trackById/${evento[0].Track__c}`)
  const tracks = await response5.json()

  ////console.log(tracks.tables.tables)

  let strHtml

  for (let m = 0; m < tracks.tables.tables.length; m++) {
    //console.log(tracks.tables.tables[m].tableNumber)
    strHtml += `
   <option value='${tracks.tables.tables[m].tableNumber}'> ${tracks.tables.tables[m].tableNumber}</option>
   `
  }
  Mesas.innerHTML = strHtml
}


function changeStyle(X) {
  X.style.color = "#28a745"


}

function changeStylee(X) {
  X.style.color = "#878787"
}




