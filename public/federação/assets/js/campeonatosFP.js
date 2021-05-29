const domain = "api"
window.onload=() => {

  renderCampeonatos();
  console.log("WindowONload")
}

//Criar evento campeonato 
let formAddCampeonato = document.getElementById("formAddCampeonato")

      formAddCampeonato.addEventListener("submit", async (event) => {
          event.preventDefault()
          const content = document.getElementById("descricao").value
          const event_name = document.getElementById("name").value
          const eventtype = "campeonatoN" //faltam os internacionais
          const createdate = document.getElementById("data_inicio").value
          const closed_date = document.getElementById("data_fim").value
          const inscprice = document.getElementById("preco_inscricao").value  
          const minreg = document.getElementById("min_inscr").value  
          let trackid = document.getElementById("Pistas")    //falta converter id
          idtrackid = trackid.options[trackid.selectedIndex].value
          console.log("idtrackid: "+idtrackid) 


 let data = {   
content: content,
 createdate: createdate,
 closed_date: closed_date,
 trackid: idtrackid,
 minreg :minreg,                  
 inscprice: inscprice,
 eventtype: eventtype,
 event_name: event_name}
 console.log(data)    

// post para hub
            let response
             console.log('antesdofetchdeAdd')
  
              response = await fetch(`${domain}/federation/ticketToEvent`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                     },
                  method: "POST",
                  body: JSON.stringify(data)
                }) 

          console.log('depoissdofetchdeAdd')
            onload()
          window.location.href="/public/federação/campeonatos.html"
      
         
      }) 


let tblCampeonatos = document.getElementById("tblCampeonatos");  

const renderCampeonatos = async () => {
    console.log("ola")

    let strHtml = `
    <thead class=" text-primary">
        <th class='w-30 text-center'>Organizador</th>
        <th class='w-20 text-center'>Nome</th>
        <th class='w-20 text-center'>Data Início</th>
        <th class='w-20 text-center'>Data Fim</th>
        <th class='w-20 text-center'>Minimo Inscrições</th>
        <th class='w-20 text-center'>Preço inscrição</th>
        <th class='w-20 text-center'>Status</th>
    </thead> <tbody>`

    const response = await fetch(`${domain}/federation/tickets`) 
    const campeonatos = await response.json()
  //  let i = 1
console.log(campeonatos)
    for (i = 0; i < campeonatos.results.length; i++) {

      
  if (campeonatos.closed_date !== null ){  
    console.log(campeonatos.results[i].properties)    //falta trocar o status 
        strHtml += `
            <tr>

                <td class='w-20 text-center'>${campeonatos.results[i].properties.subject}</td>
                <td class='w-20 text-center'>${campeonatos.results[i].properties.event_name}</td>
                <td class='w-20 text-center'>${campeonatos.results[i].properties.createdate.substring(0,10)}</td>
                <td class='w-20 text-center'>${campeonatos.results[i].properties.closed_date.substring(0,10)}</td>`


             strHtml += ` 
             <td class='w-20 text-center'>${campeonatos.results[i].properties.minreg}</td>
                <td class='w-20 text-center'>${campeonatos.results[i].properties.inscprice}</td>`

              if(campeonatos.results[i].properties.hs_pipeline_stage == 4){
                strHtml += ` 
                <td class='w-10 text-center'><span class="btn alert alert-success" style="border-radius: 20px">Insc_abertas</span></td>
                </tr>`   
              }
              
              if(campeonatos.results[i].properties.hs_pipeline_stage == 2){
                strHtml += ` 
                <td class='w-10 text-center'><span class="btn alert alert-primary" style="border-radius: 20px">Pendente</span></td>
                </tr>`   
              }
                
                       
     }
   
   }

   
    strHtml += "</tbody>" 
    tblCampeonatos.innerHTML = strHtml

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

Pistas.innerHTML = strHtml    
})
 
