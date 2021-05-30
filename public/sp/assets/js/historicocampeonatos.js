let domain = "http://127.0.0.1:3000/api"
window.onload=() => {
    let tblCampeonatos = document.getElementById("tblCampeonatos");  

    renderCampeonatos();
}



//render campeonatos
const renderCampeonatos = async () => {
              //verificar data
              var today = new Date();

              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              
              today = yyyy + '-' + mm + '-' + dd;          
                  
              console.log(today)

//falta a pista
  let strHtml = `
  <thead >
  <tr>
      <th class='w-10 text-center'> Nome</th>                
      <th class='w-30 text-center'> Data início</th>
      <th class='w-30 text-center'> Data fim</th> 	
      <th class='w-10 text-center'> Preço inscrição (€)</th>
      <th class='w-10 text-center' width = 10%> Nº inscritos</th>
      <th class='w-20 text-center'> Status</th> 	
      <th class='w-10 text-center'>Ver inscritos</th> 

  </tr>    
  </thead>
  
  <tbody>`

const response = await fetch(`${domain}/admin/fedRequests`) 
const campeonatos = await response.json()
let i = 0
for (const campeonato of campeonatos) {



  //tem de ser do tipo campeonato e a data tem de ser maior do que hoje
  if (campeonato.EventType__c == "campeonatoN" && campeonato.StartDate__c < today){
  
  strHtml += `
      <tr>
      
      <td class='w-10 text-center'>${campeonato.EventName__c}</td>
      <td class='w-30 text-center'>${campeonato.StartDate__c}</td>
      <td class='w-30 text-center'>${campeonato.EndDate__c}</td>
      <td class='w-10 text-center'>${campeonato.InscPrice__c}</td>`


      const response6 = await fetch(`${domain}/admin/events`) 
      const eventos = await response6.json()

      let n_inscritos= 0;
      let t=0
      const response = await fetch(`${domain}/admin/events`) 
      const eventoss = await response.json()
    
      for(const eventoo of eventoss){
        
        
        if(eventoo.EventName__c == campeonato.EventName__c){
          //console.log(eventoo.EventName__c + " " + id_campeonato)
    
          id = eventoo.Id
    
          const response9 = await fetch(`${domain}/admin//registrationByEventID/${id}`) 
          const inscritosss = await response9.json()
    
        
          n_inscritos=inscritosss.length

        }
        t++
      }


              
        strHtml += `<td class='w-10 text-center' width = 10%> ${n_inscritos} </td>`

        if(campeonato.Request_Status__c == "Pendente"){
          strHtml +=` <td class='w-20 text-center'><span class="badge badge-pending">${campeonato.Request_Status__c}</span></td>
          <td class='w-10 text-center'>
            
          <i value='${campeonato.EventName__c}' class="more" title="Ver mais"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQyNi42NjciIGhlaWdodD0iNDI2LjY2NyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNlMWUxZTEiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcsMCwwLDAuNyw2NC4wMDAwNDg4MjgxMjUwMiw2NC4wMDAwNDg4MjgxMjUwMikiPjwvcmVjdD48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyMDAwMDAwMDAwMDAwMDA0LDAsMCwwLjQyMDAwMDAwMDAwMDAwMDA0LDEyMy43MzM0Mjc3MzQzNzUsMTIzLjczMzE0NDUzMTI0OTk4KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiM2ODY4NjgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>
      </td>
          </tr>
      `
        }

        if(campeonato.Request_Status__c == "insc_abertas"){
          strHtml +=` <td class='w-20 text-center'><span class="badge badge-success">${campeonato.Request_Status__c}</span></td>
          <td class='w-10 text-center'>
          <i value='${campeonato.EventName__c}' class="more" title="Ver mais"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQyNi42NjciIGhlaWdodD0iNDI2LjY2NyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNlMWUxZTEiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcsMCwwLDAuNyw2NC4wMDAwNDg4MjgxMjUwMiw2NC4wMDAwNDg4MjgxMjUwMikiPjwvcmVjdD48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyMDAwMDAwMDAwMDAwMDA0LDAsMCwwLjQyMDAwMDAwMDAwMDAwMDA0LDEyMy43MzM0Mjc3MzQzNzUsMTIzLjczMzE0NDUzMTI0OTk4KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiM2ODY4NjgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>
      </td>
          </tr>
      `           
        }

}


}
strHtml += "</tbody>"
document.getElementById("tblCampeonatos").innerHTML += strHtml




//botão ver mais 
const btnMore = document.getElementsByClassName("more")
for (let i = 0; i < btnMore.length; i++) {
btnMore[i].addEventListener("click", () => {

  //get id trofeu selecionado
  let id_campeonato = btnMore[i].getAttribute("value");
  console.log("O evento selecionado é: " + id_campeonato)

  setCookie('id_campeonato', id_campeonato, 1);    //trocar para id se possível
  window.location.href = "dadoscampeonato.html"
  
})
}


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
