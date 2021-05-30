let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {
  let tblTrofeus = document.getElementById("tblTrofeus");  

  renderTrofeus();
}


//Criar evento  
let formAddTrofeu = document.getElementById("formAddTrofeu")

      formAddTrofeu.addEventListener("submit", async (event) => {
          event.preventDefault()
          const name = document.getElementById("name").value
          const event_type = "trofeu" //confirmar se está assim
          const event_status = "espera_conf"
          const data_inicio = document.getElementById("data_inicio").value
          const data_fim = document.getElementById("data_fim").value
          const preco_inscricao = document.getElementById("preco_inscricao").value  
          const min_regist = document.getElementById("min_inscr").value  

          let idpista = document.getElementById("Pistas")    //falta converter id
       
          console.log("pista " + idpista.options[idpista.selectedIndex].value)

          id_pista_id = idpista.options[idpista.selectedIndex].value
           
          let Webcelos = document.getElementsByName("idWebcelos")
          console.log(Webcelos)

          //dados webcelos
          let campanha =""
          let campanha2=""
          let arrayCampanha=[]
          for (var i = 0; i < Webcelos.length; i++) {         
            if (Webcelos[i].checked == true) {
                id_webcelos_id= Webcelos[i].value
                console.log("valor serviço "+ id_webcelos_id)

                if(id_webcelos_id==1){
                    campanha = "cmd" //promocao (digital)
                    arrayCampanha.push(campanha)
                }
                if(id_webcelos_id==2){
                    campanha="cmd"   //promocao e reportagem
                    campanha2+="cvid"
                    arrayCampanha.push(campanha,campanha2)
                }
                if(id_webcelos_id==3){
                    campanha="cvid" //reportagem(video)
                    arrayCampanha.push(campanha)
                }
     
            }}

          

         
// console.log(name);
// console.log(event_type);
// console.log(event_status);
// console.log(data_inicio);
// console.log(data_fim);  
// console.log(id_pista_id);
// console.log(preco_inscricao);     
// console.log(arrayCampanha);



let data = {
  EventName__c: name,
  EventStatus__c: event_status,
  EventType__c: event_type,
  InscPrice__c: preco_inscricao,
  StartDate__c: data_inicio,
  CloseDate__c: data_fim,
  Track__c: id_pista_id,
  CapacityTeams__c: 0,
  arrayCampanha: arrayCampanha,
  MinReg__c: min_regist
  };

console.log(data);
         
// post criar trofeu
            let response
              console.log('antesdofetchdeAdd')
  
              response = await fetch(`${domain}/admin/events`, {
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  method: "POST",
                  body: JSON.stringify(data),
                }) 

          let response2
          console.log('antesdofetchdeAdd')
          window.location.href="/public/sp/proximostrofeus.html"  
      }) 
   


      //Render trofeus
      const renderTrofeus = async () => {
                //verificar data
                var today = new Date();
      
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
              
                today = yyyy + '-' + mm + '-' + dd;  
    
          let strHtml = `
          <thead >
          <tr> 
              <th class='w-30 text-center' > Nome</th>             
              <th class='w-20 text-center'> Pista</th>  
              <th class='w-20 text-center' width = 10%> Data início</th>
              <th class='w-20 text-center' width = 10%> Data fim</th>	
              <th class='w-10 text-center' width = 10%> Preço (€) inscrição</th>
              <th class='w-20 text-center' width = 10%> Minimo inscrições</th>
              <th class='w-10 text-center' width = 10%> Nº de inscritos</th>
              <th class='w-20 text-center'> Status</th> 	
              <th class='w-10 text-center'> Inscritos</th> 
              <th class='w-10 text-center'> Apagar</th>
          </tr>    
          </thead>
          
          <tbody>`
  
        const response = await fetch(`${domain}/admin/events`) 
        const trofeus = await response.json()
        //console.log(trofeus)
        let i = 1
        let estado
        for (const trofeu of trofeus) {
        
          
          if(trofeu.EventType__c=="trofeu" && (trofeu.EventStatus__c == "espera_conf" ||  trofeu.EventStatus__c == "insc_fechadas"||  trofeu.EventStatus__c == "insc_abertas" || trofeu.EventStatus__c == "rejeitado") && trofeu.StartDate__c > today){
            //console.log(trofeus)
            strHtml += `
                <tr>
                
                    <td class='w-30 text-center'>${trofeu.EventName__c}</td>`

                    const response2 = await fetch(`${domain}/admin/trackById/${trofeu.Track__c}`) 
                    const pistas = await response2.json()

                      strHtml += `
                            <td class='w-0 text-center' >${pistas.track.TrackName__c} </td>`
                
                 

                    strHtml +=   
                    `<td class='w-20 text-center'width = 10%>${trofeu.StartDate__c}</td>
                    <td class='w-20 text-center'width = 10%>${trofeu.CloseDate__c}</td>
                    <td class='w-10 text-center' width = 10%>${trofeu.InscPrice__c}</td>
                    <td class='w-10 text-center' width = 10%>${trofeu.MinReg__c}</td>
                    `


                    const response5 = await fetch(`${domain}/admin//registrationByEventID/${trofeu.Id}`) 
                    const inscritos = await response5.json()
                    //console.log(inscritos.length)

                     
                    let n_inscritos= 0;
                      //console.log("entrou")
                    
                      n_inscritos=inscritos.length
                    
                    estado =trofeu.EventStatus__c
                    
                    console.log(estado)
                    
                      strHtml += `<td class='w-10 text-center' width = 10%> ${n_inscritos} </td>`

                    if(trofeu.EventStatus__c == "espera_conf"){
                      strHtml +=   
                      `<td class='w-10 text-center'><span class="badge badge-pending" >${trofeu.EventStatus__c}</span></td>`
                    }
                    if(trofeu.EventStatus__c == "insc_fechadas"){
                      strHtml +=   
                      `<td class='w-10 text-center'><span class="badge badge-pending" >${trofeu.EventStatus__c}</span></td>`
                    }

                    if(trofeu.EventStatus__c == "insc_abertas"){
                      strHtml +=   
                      `<td class='w-10 text-center'><button class="badge badge-success fechar" value='${trofeu.Id}'>${trofeu.EventStatus__c}</button></td>`
                    }

                    if(trofeu.EventStatus__c == "rejeitado"){
                      strHtml +=   
                      `<td class='w-10 text-center'><span class="badge badge-rejected">${trofeu.EventStatus__c}</span></td>`
                    }


                    strHtml +=   
                    `
                    <td class='w-05 text-center'> 
                        <p>  </p><i value='${trofeu.Id}' class="more" title="Ver inscritos"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC41MSwwLDAsMC41MSwxMDQuNTMzNDEzMDg1OTM3NTMsMTA0LjUzMzE3MzgyODEyNDk3KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiMzODM4MzgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjMzgzODM4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjMzgzODM4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>  
                    </td>
                    <td class='w-10 text-center'>
                      <i value='${trofeu.Id}' class='fas fa-trash-alt apagar' style="color:#f38b03"></i>
                      </td>
                </tr>
            `
            i++
        }
      }
        strHtml += "</tbody>"
        tblTrofeus.innerHTML = strHtml



      //botão ver mais 
     const btnMore = document.getElementsByClassName("more")
     for (let i = 0; i < btnMore.length; i++) {
      btnMore[i].addEventListener("click", async(event) => {

          //get id trofeu selecionado
         let id_trofeu = btnMore[i].getAttribute("value");
         console.log("O evento selecionado é: " + id_trofeu)
         const response6 = await fetch(`${domain}/admin/eventById/${id_trofeu}`) 
        const trofeu = await response6.json()
        console.log(trofeu)

         setCookie('id_trofeu', id_trofeu, 1);
         console.log(trofeu[0].EventName__c)
         if(trofeu[0].EventStatus__c == "insc_fechadas"){
         
          console.log("fechadas");
          window.location.href = "distribuiTrofeus.html"
         
         }
         else{
        window.location.href = "/public/sp/dadostrofeu.html"
        console.log("else");
      }
          
      })

    }
  // Gerir o clique no ícone de Remover      
  const btnDelete = document.getElementsByClassName("apagar")
  for (let i = 0; i < btnDelete.length; i++) {
      console.log('entrou' + btnDelete[i].value)
      btnDelete[i].addEventListener("click", () => {
          swal.fire({
              title: 'Tem a certeza?',
              text: "Não será possível reverter a remoção!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#66bb6a',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Remover'
          }).then(async (result) => {
              if (result.value) {
                  let Id = btnDelete[i].getAttribute("value")

                  try {
                      const response = await fetch(`${domain}/admin/deleteEventByID/${Id}`, {
                          method: "DELETE"
                      })
                      if (response.status == 204) {
                          swal('Removido!', 'O evento foi removido!', 'success')
                      }
                  } catch (err) {
                      swal({
                          type: 'error',
                          title: 'Erro',
                          text: err
                      })
                  }
                  renderTrofeus()
              }
          })
          renderTrofeus()
      })
  }


     

  let n_inscritos= 0; 
     
//Botão fechar inscrições
const btnFechar = document.getElementsByClassName("fechar")
for (let i = 0; i < btnFechar.length; i++) {
btnFechar[i].addEventListener("click", async(event) => {

   //get id trofeu selecionado
  let id_trofeu = btnFechar[i].getAttribute("value");
  console.log(id_trofeu);
    
  const response8 = await fetch(`${domain}/admin//registrationByEventID/${id_trofeu}`) 
  const inscritos = await response8.json()
  n_inscritos=inscritos.length
  const response9 = await fetch(`${domain}/admin/eventById/${id_trofeu}`) 
  const trofeuF = await response9.json()

  console.log(trofeuF[0].EventName__c + trofeuF[0].MinReg__c+ n_inscritos)

  await swal.fire({
    title: 'Pretende:',
    html:`
    <input type="radio" id="fechar" name="tipo" value="fechar">
    <label for="fechar">Fechar inscrições</label><br>
    <input type="radio" id="cancelar" name="tipo" value="cancelar">
    <label for="cancelar">Cancelar evento</label><br>
    `,
    focusConfirm: false,
    preConfirm: async (event) =>{
        let tipo
        if (document.getElementById('fechar').checked) {
           tipo = document.getElementById('fechar').value;

          if (trofeuF[0].MinReg__c < n_inscritos || trofeuF[0].MinReg__c == n_inscritos){

          swal.fire({
                title: 'Tem a certeza?',
                text: "As inscrições serão fechadas!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#66bb6a',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Continuar'
            }).then(async (result) => {
                if (result.value) {
                let  response = await fetch(`${domain}/admin/closeTrofeuRegs/${id_trofeu}`) 
                      }
                      window.location.href="/public/sp/proximostrofeus.html"
                })
            
          } else {
            Swal.fire({
              text: "Ainda não tem inscritos suficientes para poder fechar as inscições!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              //cancelButtonColor: '#d33',
              //confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.isConfirmed) {
                // Swal.fire(
                //   'Deleted!',
                //   'Your file has been deleted.',
                //   'success'
                // )
              }
            })
          }

          } //fecha if fechar

          if (document.getElementById('cancelar').checked) {
            tipo = document.getElementById('cancelar').value;
            swal.fire({
              title: 'Tem a certeza?',
              text: "O evento será cancelado e os pilotos reembolsados!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#66bb6a',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Continuar'
          }).then(async (result) => {
              if (result.value) {
               let  response = await fetch(`${domain}/admin/cancelEvent/${id_trofeu}`) 
               console.log("novo estado: " + trofeus.EventStatus__c)
                    }
                   window.location.href="/public/sp/proximostrofeus.html"
              })

           }  //fecha if cancelar


     }
    
                            
})


     
  })
  } //fecha for
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



//Mostrar Pistas
let Pistas = document.getElementById("Pistas")
Pistas.addEventListener("mousedown", async(event) => {
  console.log("entrei no select Pistas")
    
let strHtml 

const response = await fetch(`${domain}/admin/tracks`)
const tracks = await response.json()
let i =1
for (const track of tracks) {

strHtml +=`
   <option value='${track.Id}'> ${track.TrackName__c}</option>
   `

   i++
}


//strHtml += `<select>`
Pistas.innerHTML = strHtml    
})