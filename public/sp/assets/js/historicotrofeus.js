let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {
  let tblTrofeus = document.getElementById("tblTrofeus");  

  renderTrofeus();

} //fecha window onload    

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
    <th class='w-20 text-center'> Data início</th>
    <th class='w-20 text-center'> Data fim</th>	
    <th class='w-10 text-center' width = 15%> Preço de inscrição (€)</th>
    <th class='w-20 text-center'> Minimo inscrições</th>
    <th class='w-10 text-center' width = 10%> Nº de inscritos</th>
    <th class='w-20 text-center'> Status</th> 	
    <th class='w-10 text-center' width = 10%> Inscritos</th> 
    <th class='w-10 text-center' width = 10%> Apagar</th>
</tr>    
</thead>

<tbody>`

const response = await fetch(`${domain}/admin/events`) 
const trofeus = await response.json()
//console.log(trofeus)
let i = 1
let estado
for (const trofeu of trofeus) {

if(trofeu.EventType__c=="trofeu" && trofeu.CloseDate__c < today || trofeu.EventStatus__c== "cancelado" ||  trofeu.EventStatus__c== "rejeitado" ){
  //console.log(trofeus)
  strHtml += `
      <tr>
      
          <td class='w-30 text-center'>${trofeu.EventName__c}</td>`

          console.log(trofeu.Track__c)

          const response2 = await fetch(`${domain}/admin/trackById/${trofeu.Track__c}`) 
          const pistas = await response2.json()

          if(pistas!="undefined"){
          let nomeP = pistas.track.TrackName__c
          console.log(nomeP);
          
            strHtml += `
                  <td class='w-20 text-center' >${nomeP} </td>`
       
          }
          else{
            strHtml += `
            <td class='w-20 text-center' > A pista já não existe </td>`
          }
          strHtml +=   
          `<td class='w-20 text-center'>${trofeu.StartDate__c}</td>
          <td class='w-20 text-center'>${trofeu.CloseDate__c}</td>
          <td class='w-10 text-center' width = 15%>${trofeu.InscPrice__c}</td>
          <td class='w-10 text-center' width = 15%>${trofeu.MinReg__c}</td>
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
          
          if(trofeu.EventStatus__c == "cancelado"){
            strHtml +=   
            `<td class='w-10 text-center'><span class="badge badge-rejected cancelado">${trofeu.EventStatus__c}</span></td>`
          }

          strHtml +=   
          `
          <td class='w-10 text-center' width = 10%>
              <i value='${trofeu.Id}' class="more" title="Ver inscritos"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC41MSwwLDAsMC41MSwxMDQuNTMzNDEzMDg1OTM3NTMsMTA0LjUzMzE3MzgyODEyNDk3KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiMzODM4MzgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjMzgzODM4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjMzgzODM4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>  
          </td>
          <td class='w-20 text-center'>
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
window.location.href = "dadostrofeu.html"
console.log("else");
}

})


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
    confirmButtonColor: '#3085d6',
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

}


}

