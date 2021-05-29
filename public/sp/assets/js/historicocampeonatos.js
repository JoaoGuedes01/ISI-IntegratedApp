let domain = "api"
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
      <th class='w-10 text-center'></th> 

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
              <i value='${campeonato.Id}' class="aceitar" title="Aceitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNjUsMCwwLDAuNjUsODkuNjAwMDAwMDAwMDAwMDIsODkuNjAwMDAwMDAwMDAwMDIpIj48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im01MTIgNTguNjY3OTY5YzAtMzIuMzYzMjgxLTI2LjMwNDY4OC01OC42Njc5NjktNTguNjY3OTY5LTU4LjY2Nzk2OWgtMzk0LjY2NDA2MmMtMzIuMzYzMjgxIDAtNTguNjY3OTY5IDI2LjMwNDY4OC01OC42Njc5NjkgNTguNjY3OTY5djM5NC42NjQwNjJjMCAzMi4zNjMyODEgMjYuMzA0Njg4IDU4LjY2Nzk2OSA1OC42Njc5NjkgNTguNjY3OTY5aDM5NC42NjQwNjJjMzIuMzYzMjgxIDAgNTguNjY3OTY5LTI2LjMwNDY4OCA1OC42Njc5NjktNTguNjY3OTY5em0wIDAiIGZpbGw9IiM4NGQ0ODAiIGRhdGEtb3JpZ2luYWw9IiM0Y2FmNTAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0zODUuNzUgMTcxLjU4NTkzOGM4LjMzOTg0NCA4LjMzOTg0MyA4LjMzOTg0NCAyMS44MjAzMTIgMCAzMC4xNjQwNjJsLTEzOC42Njc5NjkgMTM4LjY2NDA2MmMtNC4xNjAxNTYgNC4xNjAxNTctOS42MjEwOTMgNi4yNTM5MDctMTUuMDgyMDMxIDYuMjUzOTA3cy0xMC45MjE4NzUtMi4wOTM3NS0xNS4wODIwMzEtNi4yNTM5MDdsLTY5LjMzMjAzMS02OS4zMzIwMzFjLTguMzQzNzUtOC4zMzk4NDMtOC4zNDM3NS0yMS44MjQyMTkgMC0zMC4xNjQwNjIgOC4zMzk4NDMtOC4zNDM3NSAyMS44MjAzMTItOC4zNDM3NSAzMC4xNjQwNjIgMGw1NC4yNSA1NC4yNSAxMjMuNTg1OTM4LTEyMy41ODIwMzFjOC4zMzk4NDMtOC4zNDM3NSAyMS44MjAzMTItOC4zNDM3NSAzMC4xNjQwNjIgMHptMCAwIiBmaWxsPSIjMDlhODAyIiBkYXRhLW9yaWdpbmFsPSIjZmFmYWZhIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PC9nPjwvc3ZnPg==" /> </i>
              <i value='${campeonato.Id}' class="rejeitar" title="Rejeitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQwOC40ODMgNDA4LjQ4MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQwOC40ODMiIGhlaWdodD0iNDA4LjQ4MyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNmZmM0NzgiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjY1LDAsMCwwLjY1LDcxLjQ4NDUyNTI5OTA3MjI2LDcxLjQ4NDUyNTI5OTA3MjI2KSI+PC9yZWN0PjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNDEwMDAwMDAwMDAwMDAwMDMsMCwwLDAuNDEwMDAwMDAwMDAwMDAwMDMsMTIwLjUwMjQ4MTAwMjgwNzQxLDEyMC41MDI0ODU1MDQxNTAzNCkiPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTg3Ljc0OCwzODguNzg0YzAuNDYxLDExLjAxLDkuNTIxLDE5LjY5OSwyMC41MzksMTkuNjk5aDE5MS45MTFjMTEuMDE4LDAsMjAuMDc4LTguNjg5LDIwLjUzOS0xOS42OTlsMTMuNzA1LTI4OS4zMTYgICAgSDc0LjA0M0w4Ny43NDgsMzg4Ljc4NHogTTI0Ny42NTUsMTcxLjMyOWMwLTQuNjEsMy43MzgtOC4zNDksOC4zNS04LjM0OWgxMy4zNTVjNC42MDksMCw4LjM1LDMuNzM4LDguMzUsOC4zNDl2MTY1LjI5MyAgICBjMCw0LjYxMS0zLjczOCw4LjM0OS04LjM1LDguMzQ5aC0xMy4zNTVjLTQuNjEsMC04LjM1LTMuNzM2LTguMzUtOC4zNDlWMTcxLjMyOXogTTE4OS4yMTYsMTcxLjMyOSAgICBjMC00LjYxLDMuNzM4LTguMzQ5LDguMzQ5LTguMzQ5aDEzLjM1NWM0LjYwOSwwLDguMzQ5LDMuNzM4LDguMzQ5LDguMzQ5djE2NS4yOTNjMCw0LjYxMS0zLjczNyw4LjM0OS04LjM0OSw4LjM0OWgtMTMuMzU1ICAgIGMtNC42MSwwLTguMzQ5LTMuNzM2LTguMzQ5LTguMzQ5VjE3MS4zMjlMMTg5LjIxNiwxNzEuMzI5eiBNMTMwLjc3NSwxNzEuMzI5YzAtNC42MSwzLjczOC04LjM0OSw4LjM0OS04LjM0OWgxMy4zNTYgICAgYzQuNjEsMCw4LjM0OSwzLjczOCw4LjM0OSw4LjM0OXYxNjUuMjkzYzAsNC42MTEtMy43MzgsOC4zNDktOC4zNDksOC4zNDloLTEzLjM1NmMtNC42MSwwLTguMzQ5LTMuNzM2LTguMzQ5LTguMzQ5VjE3MS4zMjl6IiBmaWxsPSIjZjM4YjAzIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CgkJPHBhdGggZD0iTTM0My41NjcsMjEuMDQzaC04OC41MzVWNC4zMDVjMC0yLjM3Ny0xLjkyNy00LjMwNS00LjMwNS00LjMwNWgtOTIuOTcxYy0yLjM3NywwLTQuMzA0LDEuOTI4LTQuMzA0LDQuMzA1djE2LjczN0g2NC45MTYgICAgYy03LjEyNSwwLTEyLjksNS43NzYtMTIuOSwxMi45MDFWNzQuNDdoMzA0LjQ1MVYzMy45NDRDMzU2LjQ2NywyNi44MTksMzUwLjY5MiwyMS4wNDMsMzQzLjU2NywyMS4wNDN6IiBmaWxsPSIjZjM4YjAzIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" /></i> 
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




//Botão aceitar
const btnAceitar = document.getElementsByClassName("aceitar")
for (let i = 0; i < btnAceitar.length; i++) {
btnAceitar[i].addEventListener("click", () => {

   //get id trofeu selecionado
  let id_campeonato = btnAceitar[i].getAttribute("value");
  console.log("O evento selecionado é: " + id_campeonato)

  swal.fire({
      title: 'Tem a certeza?',
      text: "O campeonato será aceite!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#66bb6a',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceitar'
  }).then(async (result) => {
      if (result.value) {
          let Id = btnAceitar[i].getAttribute("value")
          console.log(Id);


          
          //precisamos dos dado do evento selecionado
          let t = 0
          for(const campeonato of campeonatos){

            if(campeonato.Id == Id){
              console.log(campeonato)


                    //criar evento na salesforce do tipo campeonato
                            let response
                            console.log('antesdofetchdeAdd')
                
                            response = await fetch(`${domain}/admin/events`, {
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                method: "POST",
                                body: `StartDate__c=${campeonato.StartDate__c}&CloseDate__c=${campeonato.EndDate__c}&InscPrice__c=${campeonato.InscPrice__c} &CapacityTeams__c=${0}
                                &EventType__c=${campeonato.EventType__c}&EventStatus__c="insc_abertas"&EventName__c=${campeonato.EventName__c}&Track__c=${campeonato.TrackID__c}`
                              }) 
              
                        
                        console.log('depoisdofetchdeAdd')
                        window.location.href="/public/sp/proximoscampeonatos.html"
            }

            t++
          }
              }
      })
  })
}
} 