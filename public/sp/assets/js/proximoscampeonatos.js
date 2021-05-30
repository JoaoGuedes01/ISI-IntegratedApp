let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {
    
  renderCampeonatos();
}

  let tblCampeonatos = document.getElementById("tblCampeonatos");  

const renderCampeonatos = async () => {
              //verificar data
              var today = new Date();

              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              
              today = yyyy + '-' + mm + '-' + dd;          
                  
              

//falta a pista
  let strHtml = `
  <thead >
  <tr>
      <th class='w-10 text-center'> Nome</th>                
      <th class='w-30 text-center'> Data início</th>
      <th class='w-30 text-center'> Data fim</th> 	
      <th class='w-20 text-center'> Minimo inscrições</th>
      <th class='w-10 text-center'> Preço inscrição (€)</th>
      <th class='w-10 text-center' width = 10%> Nº inscritos</th>
      <th class='w-20 text-center'> Status</th> 	
      <th class='w-10 text-center'></th> 

  </tr>    
  </thead>
  
  <tbody style='overflow: hidden'>`

const response = await fetch(`${domain}/admin/fedRequests`) 
const campeonatos = await response.json()
//console.log(campeonatos)
let i = 0
for (const campeonato of campeonatos) {



    //tem de ser do tipo campeonato e a data tem de ser maior do que hoje
    if (campeonato.EventType__c == "campeonatoN" && campeonato.StartDate__c > today){
    
    strHtml += `
        <tr>
        
        <td class='w-10 text-center'>${campeonato.EventName__c}</td>
        <td class='w-30 text-center'>${campeonato.StartDate__c}</td>
        <td class='w-30 text-center'>${campeonato.EndDate__c}</td>
        <td class='w-10 text-center'>${campeonato.MinReg__c}</td>
        <td class='w-10 text-center'>${campeonato.InscPrice__c}</td>
        `


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
                <i value='${campeonato.Id}' class="rejeitar" title="Rejeitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNjUsMCwwLDAuNjUsODkuNiw4OS42KSI+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNDUzLjMzMjAzMSAwaC0zOTQuNjY0MDYyYy0zMi4zNjMyODEgMC01OC42Njc5NjkgMjYuMzA0Njg4LTU4LjY2Nzk2OSA1OC42Njc5Njl2Mzk0LjY2NDA2MmMwIDMyLjM2MzI4MSAyNi4zMDQ2ODggNTguNjY3OTY5IDU4LjY2Nzk2OSA1OC42Njc5NjloMzk0LjY2NDA2MmMzMi4zNjMyODEgMCA1OC42Njc5NjktMjYuMzA0Njg4IDU4LjY2Nzk2OS01OC42Njc5Njl2LTM5NC42NjQwNjJjMC0zMi4zNjMyODEtMjYuMzA0Njg4LTU4LjY2Nzk2OS01OC42Njc5NjktNTguNjY3OTY5em0wIDAiIGZpbGw9IiNmZmNhODQiIGRhdGEtb3JpZ2luYWw9IiNmNDQzMzYiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0zNTAuMjczNDM4IDMyMC4xMDU0NjljOC4zMzk4NDMgOC4zNDM3NSA4LjMzOTg0MyAyMS44NDc2NTYgMCAzMC4xNjc5NjktNC4xNjAxNTcgNC4xNjAxNTYtOS42MjEwOTQgNi4yNS0xNS4wODU5MzggNi4yNS01LjQ2MDkzOCAwLTEwLjkyMTg3NS0yLjA4OTg0NC0xNS4wODIwMzEtNi4yNWwtNjQuMTA1NDY5LTY0LjEwOTM3Ni02NC4xMDU0NjkgNjQuMTA5Mzc2Yy00LjE2MDE1NiA0LjE2MDE1Ni05LjYyMTA5MyA2LjI1LTE1LjA4MjAzMSA2LjI1LTUuNDY0ODQ0IDAtMTAuOTI1NzgxLTIuMDg5ODQ0LTE1LjA4NTkzOC02LjI1LTguMzM5ODQzLTguMzIwMzEzLTguMzM5ODQzLTIxLjgyNDIxOSAwLTMwLjE2Nzk2OWw2NC4xMDkzNzYtNjQuMTA1NDY5LTY0LjEwOTM3Ni02NC4xMDU0NjljLTguMzM5ODQzLTguMzQzNzUtOC4zMzk4NDMtMjEuODQ3NjU2IDAtMzAuMTY3OTY5IDguMzQzNzUtOC4zMzk4NDMgMjEuODI0MjE5LTguMzM5ODQzIDMwLjE2Nzk2OSAwbDY0LjEwNTQ2OSA2NC4xMDkzNzYgNjQuMTA1NDY5LTY0LjEwOTM3NmM4LjM0Mzc1LTguMzM5ODQzIDIxLjgyNDIxOS04LjMzOTg0MyAzMC4xNjc5NjkgMCA4LjMzOTg0MyA4LjMyMDMxMyA4LjMzOTg0MyAyMS44MjQyMTkgMCAzMC4xNjc5NjlsLTY0LjEwOTM3NiA2NC4xMDU0Njl6bTAgMCIgZmlsbD0iI2YzOGIwMyIgZGF0YS1vcmlnaW5hbD0iI2ZhZmFmYSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" /></i> 
            <i value='${campeonato.EventName__c}' class="more" title="Ver mais"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQyNi42NjciIGhlaWdodD0iNDI2LjY2NyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNlMWUxZTEiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcsMCwwLDAuNyw2NC4wMDAwNDg4MjgxMjUwMiw2NC4wMDAwNDg4MjgxMjUwMikiPjwvcmVjdD48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyMDAwMDAwMDAwMDAwMDA0LDAsMCwwLjQyMDAwMDAwMDAwMDAwMDA0LDEyMy43MzM0Mjc3MzQzNzUsMTIzLjczMzE0NDUzMTI0OTk4KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiM2ODY4NjgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>
        </td>
            </tr>
        `
          }

          else if(campeonato.Request_Status__c == "insc_abertas"){
            strHtml +=` <td class='w-20 text-center'><span class="badge badge-success">${campeonato.Request_Status__c}</span></td>
            <td class='w-10 text-center'>
            <i value='${campeonato.Id}'  title="Aceitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjY1LDAsMCwwLjY1LDQuMTk5OTk5OTk5OTk5OTk1LDQuMTk5OTk5OTk5OTk5OTk1KSI+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMjQgMi43NWMwLTEuNTE3LTEuMjMzLTIuNzUtMi43NS0yLjc1aC0xOC41Yy0xLjUxNyAwLTIuNzUgMS4yMzMtMi43NSAyLjc1djE4LjVjMCAxLjUxNyAxLjIzMyAyLjc1IDIuNzUgMi43NWgxOC41YzEuNTE3IDAgMi43NS0xLjIzMyAyLjc1LTIuNzV6IiBmaWxsPSIjYzFkZWMyIiBkYXRhLW9yaWdpbmFsPSIjNGNhZjUwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTguMDgyIDguMDQzYy4zOTEuMzkxLjM5MSAxLjAyMyAwIDEuNDE0bC02LjUgNi41Yy0uMTk1LjE5NS0uNDUxLjI5My0uNzA3LjI5M3MtLjUxMi0uMDk4LS43MDctLjI5M2wtMy4yNS0zLjI1Yy0uMzkxLS4zOTEtLjM5MS0xLjAyNCAwLTEuNDE0LjM5MS0uMzkxIDEuMDIzLS4zOTEgMS40MTQgMGwyLjU0MyAyLjU0MyA1Ljc5My01Ljc5M2MuMzkxLS4zOTEgMS4wMjMtLjM5MSAxLjQxNCAweiIgZmlsbD0iI2IyZGFhYyIgZGF0YS1vcmlnaW5hbD0iI2ZhZmFmYSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTEyIDBoLTkuMjVjLTEuNTE3IDAtMi43NSAxLjIzMy0yLjc1IDIuNzV2MTguNWMwIDEuNTE3IDEuMjMzIDIuNzUgMi43NSAyLjc1aDkuMjV2LTguNDYxbC0uNDE4LjQxOGMtLjE5NS4xOTUtLjQ1MS4yOTMtLjcwNy4yOTNzLS41MTItLjA5OC0uNzA3LS4yOTNsLTMuMjUtMy4yNWMtLjM5MS0uMzkxLS4zOTEtMS4wMjQgMC0xLjQxNC4xOTUtLjE5NS40NTEtLjI5My43MDctLjI5M3MuNTEyLjA5OC43MDcuMjkzbDIuNTQzIDIuNTQzIDEuMTI1LTEuMTI1eiIgZmlsbD0iI2MxZGVjMiIgZGF0YS1vcmlnaW5hbD0iIzQyOTg0NiIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTcuNjI1IDExYy0uMjU2IDAtLjUxMi4wOTgtLjcwNy4yOTMtLjM5MS4zOTEtLjM5MSAxLjAyNCAwIDEuNDE0bDMuMjUgMy4yNWMuMTk1LjE5NS40NTEuMjkzLjcwNy4yOTNzLjUxMi0uMDk4LjcwNy0uMjkzbC40MTgtLjQxOHYtMi44MjhsLTEuMTI1IDEuMTI1LTIuNTQzLTIuNTQzYy0uMTk1LS4xOTUtLjQ1MS0uMjkzLS43MDctLjI5M3oiIGZpbGw9IiNiMmRhYWMiIGRhdGEtb3JpZ2luYWw9IiNkYWRhZGEiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9zdmc+" /></i> 
            <i value='${campeonato.Id}'  title="Rejeitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNjUsMCwwLDAuNjUsODkuNiw4OS42KSI+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNDUzLjMzMjAzMSAwaC0zOTQuNjY0MDYyYy0zMi4zNjMyODEgMC01OC42Njc5NjkgMjYuMzA0Njg4LTU4LjY2Nzk2OSA1OC42Njc5Njl2Mzk0LjY2NDA2MmMwIDMyLjM2MzI4MSAyNi4zMDQ2ODggNTguNjY3OTY5IDU4LjY2Nzk2OSA1OC42Njc5NjloMzk0LjY2NDA2MmMzMi4zNjMyODEgMCA1OC42Njc5NjktMjYuMzA0Njg4IDU4LjY2Nzk2OS01OC42Njc5Njl2LTM5NC42NjQwNjJjMC0zMi4zNjMyODEtMjYuMzA0Njg4LTU4LjY2Nzk2OS01OC42Njc5NjktNTguNjY3OTY5em0wIDAiIGZpbGw9IiNmZmRkYWYiIGRhdGEtb3JpZ2luYWw9IiNmNDQzMzYiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0zNTAuMjczNDM4IDMyMC4xMDU0NjljOC4zMzk4NDMgOC4zNDM3NSA4LjMzOTg0MyAyMS44NDc2NTYgMCAzMC4xNjc5NjktNC4xNjAxNTcgNC4xNjAxNTYtOS42MjEwOTQgNi4yNS0xNS4wODU5MzggNi4yNS01LjQ2MDkzOCAwLTEwLjkyMTg3NS0yLjA4OTg0NC0xNS4wODIwMzEtNi4yNWwtNjQuMTA1NDY5LTY0LjEwOTM3Ni02NC4xMDU0NjkgNjQuMTA5Mzc2Yy00LjE2MDE1NiA0LjE2MDE1Ni05LjYyMTA5MyA2LjI1LTE1LjA4MjAzMSA2LjI1LTUuNDY0ODQ0IDAtMTAuOTI1NzgxLTIuMDg5ODQ0LTE1LjA4NTkzOC02LjI1LTguMzM5ODQzLTguMzIwMzEzLTguMzM5ODQzLTIxLjgyNDIxOSAwLTMwLjE2Nzk2OWw2NC4xMDkzNzYtNjQuMTA1NDY5LTY0LjEwOTM3Ni02NC4xMDU0NjljLTguMzM5ODQzLTguMzQzNzUtOC4zMzk4NDMtMjEuODQ3NjU2IDAtMzAuMTY3OTY5IDguMzQzNzUtOC4zMzk4NDMgMjEuODI0MjE5LTguMzM5ODQzIDMwLjE2Nzk2OSAwbDY0LjEwNTQ2OSA2NC4xMDkzNzYgNjQuMTA1NDY5LTY0LjEwOTM3NmM4LjM0Mzc1LTguMzM5ODQzIDIxLjgyNDIxOS04LjMzOTg0MyAzMC4xNjc5NjkgMCA4LjMzOTg0MyA4LjMyMDMxMyA4LjMzOTg0MyAyMS44MjQyMTkgMCAzMC4xNjc5NjlsLTY0LjEwOTM3NiA2NC4xMDU0Njl6bTAgMCIgZmlsbD0iI2ZmYzg4MCIgZGF0YS1vcmlnaW5hbD0iI2ZhZmFmYSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" /></i>
            <i value='${campeonato.EventName__c}' class="more" title="Ver mais"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQyNi42NjciIGhlaWdodD0iNDI2LjY2NyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNlMWUxZTEiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcsMCwwLDAuNyw2NC4wMDAwNDg4MjgxMjUwMiw2NC4wMDAwNDg4MjgxMjUwMikiPjwvcmVjdD48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyMDAwMDAwMDAwMDAwMDA0LDAsMCwwLjQyMDAwMDAwMDAwMDAwMDA0LDEyMy43MzM0Mjc3MzQzNzUsMTIzLjczMzE0NDUzMTI0OTk4KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiM2ODY4NjgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>
        </td>
            </tr>
        `    
               
          }

          else if(campeonato.Request_Status__c == "rejected"){
            
            strHtml +=` <td class='w-20 text-center'><span class="badge badge-rejected">Rejeitado</span></td>
            <td class='w-10 text-center'>
            <i value='${campeonato.Id}'  title="Aceitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjY1LDAsMCwwLjY1LDQuMTk5OTk5OTk5OTk5OTk1LDQuMTk5OTk5OTk5OTk5OTk1KSI+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMjQgMi43NWMwLTEuNTE3LTEuMjMzLTIuNzUtMi43NS0yLjc1aC0xOC41Yy0xLjUxNyAwLTIuNzUgMS4yMzMtMi43NSAyLjc1djE4LjVjMCAxLjUxNyAxLjIzMyAyLjc1IDIuNzUgMi43NWgxOC41YzEuNTE3IDAgMi43NS0xLjIzMyAyLjc1LTIuNzV6IiBmaWxsPSIjYzFkZWMyIiBkYXRhLW9yaWdpbmFsPSIjNGNhZjUwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTguMDgyIDguMDQzYy4zOTEuMzkxLjM5MSAxLjAyMyAwIDEuNDE0bC02LjUgNi41Yy0uMTk1LjE5NS0uNDUxLjI5My0uNzA3LjI5M3MtLjUxMi0uMDk4LS43MDctLjI5M2wtMy4yNS0zLjI1Yy0uMzkxLS4zOTEtLjM5MS0xLjAyNCAwLTEuNDE0LjM5MS0uMzkxIDEuMDIzLS4zOTEgMS40MTQgMGwyLjU0MyAyLjU0MyA1Ljc5My01Ljc5M2MuMzkxLS4zOTEgMS4wMjMtLjM5MSAxLjQxNCAweiIgZmlsbD0iI2IyZGFhYyIgZGF0YS1vcmlnaW5hbD0iI2ZhZmFmYSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTEyIDBoLTkuMjVjLTEuNTE3IDAtMi43NSAxLjIzMy0yLjc1IDIuNzV2MTguNWMwIDEuNTE3IDEuMjMzIDIuNzUgMi43NSAyLjc1aDkuMjV2LTguNDYxbC0uNDE4LjQxOGMtLjE5NS4xOTUtLjQ1MS4yOTMtLjcwNy4yOTNzLS41MTItLjA5OC0uNzA3LS4yOTNsLTMuMjUtMy4yNWMtLjM5MS0uMzkxLS4zOTEtMS4wMjQgMC0xLjQxNC4xOTUtLjE5NS40NTEtLjI5My43MDctLjI5M3MuNTEyLjA5OC43MDcuMjkzbDIuNTQzIDIuNTQzIDEuMTI1LTEuMTI1eiIgZmlsbD0iI2MxZGVjMiIgZGF0YS1vcmlnaW5hbD0iIzQyOTg0NiIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTcuNjI1IDExYy0uMjU2IDAtLjUxMi4wOTgtLjcwNy4yOTMtLjM5MS4zOTEtLjM5MSAxLjAyNCAwIDEuNDE0bDMuMjUgMy4yNWMuMTk1LjE5NS40NTEuMjkzLjcwNy4yOTNzLjUxMi0uMDk4LjcwNy0uMjkzbC40MTgtLjQxOHYtMi44MjhsLTEuMTI1IDEuMTI1LTIuNTQzLTIuNTQzYy0uMTk1LS4xOTUtLjQ1MS0uMjkzLS43MDctLjI5M3oiIGZpbGw9IiNiMmRhYWMiIGRhdGEtb3JpZ2luYWw9IiNkYWRhZGEiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9zdmc+" /></i> 
                        <i value='${campeonato.Id}'  title="Rejeitar campeonato"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuNjUsMCwwLDAuNjUsODkuNiw4OS42KSI+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNDUzLjMzMjAzMSAwaC0zOTQuNjY0MDYyYy0zMi4zNjMyODEgMC01OC42Njc5NjkgMjYuMzA0Njg4LTU4LjY2Nzk2OSA1OC42Njc5Njl2Mzk0LjY2NDA2MmMwIDMyLjM2MzI4MSAyNi4zMDQ2ODggNTguNjY3OTY5IDU4LjY2Nzk2OSA1OC42Njc5NjloMzk0LjY2NDA2MmMzMi4zNjMyODEgMCA1OC42Njc5NjktMjYuMzA0Njg4IDU4LjY2Nzk2OS01OC42Njc5Njl2LTM5NC42NjQwNjJjMC0zMi4zNjMyODEtMjYuMzA0Njg4LTU4LjY2Nzk2OS01OC42Njc5NjktNTguNjY3OTY5em0wIDAiIGZpbGw9IiNmZmRkYWYiIGRhdGEtb3JpZ2luYWw9IiNmNDQzMzYiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0zNTAuMjczNDM4IDMyMC4xMDU0NjljOC4zMzk4NDMgOC4zNDM3NSA4LjMzOTg0MyAyMS44NDc2NTYgMCAzMC4xNjc5NjktNC4xNjAxNTcgNC4xNjAxNTYtOS42MjEwOTQgNi4yNS0xNS4wODU5MzggNi4yNS01LjQ2MDkzOCAwLTEwLjkyMTg3NS0yLjA4OTg0NC0xNS4wODIwMzEtNi4yNWwtNjQuMTA1NDY5LTY0LjEwOTM3Ni02NC4xMDU0NjkgNjQuMTA5Mzc2Yy00LjE2MDE1NiA0LjE2MDE1Ni05LjYyMTA5MyA2LjI1LTE1LjA4MjAzMSA2LjI1LTUuNDY0ODQ0IDAtMTAuOTI1NzgxLTIuMDg5ODQ0LTE1LjA4NTkzOC02LjI1LTguMzM5ODQzLTguMzIwMzEzLTguMzM5ODQzLTIxLjgyNDIxOSAwLTMwLjE2Nzk2OWw2NC4xMDkzNzYtNjQuMTA1NDY5LTY0LjEwOTM3Ni02NC4xMDU0NjljLTguMzM5ODQzLTguMzQzNzUtOC4zMzk4NDMtMjEuODQ3NjU2IDAtMzAuMTY3OTY5IDguMzQzNzUtOC4zMzk4NDMgMjEuODI0MjE5LTguMzM5ODQzIDMwLjE2Nzk2OSAwbDY0LjEwNTQ2OSA2NC4xMDkzNzYgNjQuMTA1NDY5LTY0LjEwOTM3NmM4LjM0Mzc1LTguMzM5ODQzIDIxLjgyNDIxOS04LjMzOTg0MyAzMC4xNjc5NjkgMCA4LjMzOTg0MyA4LjMyMDMxMyA4LjMzOTg0MyAyMS44MjQyMTkgMCAzMC4xNjc5NjlsLTY0LjEwOTM3NiA2NC4xMDU0Njl6bTAgMCIgZmlsbD0iI2ZmYzg4MCIgZGF0YS1vcmlnaW5hbD0iI2ZhZmFmYSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" /></i>
            <i value='${campeonato.EventName__c}' title="Ver mais"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQyNi42NjciIGhlaWdodD0iNDI2LjY2NyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNlMWUxZTEiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcsMCwwLDAuNyw2NC4wMDAwNDg4MjgxMjUwMiw2NC4wMDAwNDg4MjgxMjUwMikiPjwvcmVjdD48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyMDAwMDAwMDAwMDAwMDA0LDAsMCwwLjQyMDAwMDAwMDAwMDAwMDA0LDEyMy43MzM0Mjc3MzQzNzUsMTIzLjczMzE0NDUzMTI0OTk4KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiM2ODY4NjgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>
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
             // console.log(campeonato)


                    //criar evento na salesforce do tipo campeonato
                            
                            console.log('antesdofetchdeAdd')

                            let campanha =""
                            let campanha2=""
                            let arrayCampanha=[]

                            campanha = "di" //promocao (digital)
                            arrayCampanha.push(campanha)

                            let data = {
                              EventName__c:campeonato.EventName__c,
                              EventType__c:campeonato.EventType__c,
                              InscPrice__c:campeonato.InscPrice__c,
                              StartDate__c:campeonato.StartDate__c,
                              CloseDate__c:campeonato.EndDate__c,
                              Track__c:campeonato.TrackID__c,
                              CapacityTeams__c:10,
                              arrayCampanha: arrayCampanha,
                              MinReg__c:10
                            }

                
                            let response = await fetch(`${domain}/admin/events`, {
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Accept': 'application/json'
                                },
                                method: "POST",
                                body: JSON.stringify(data)
                              }) 

                              console.log("ola")
                              const aceitee = await response.json()
              
                      
                        const response2 = await fetch(`${domain}/admin/acceptFedReq/${campeonato.Id}`) 
                        const aceite = await response2.json()

                        console.log("ola")
                        console.log(aceitee)
                        console.log(aceite)

                        if (aceitee.status == 200 && aceite.status == 200) {
                          swal.fire('Sucesso', 'Campeonato aceite! Faça refresh da página.' , 'success')
                          //window.location.href="/public/sp/proximoscampeonatos.html"
                      }
                      else {
                      swal.fire({
                          type: 'error',
                          title: 'Erro'
                      })
                    }

                        //window.location.href="/public/sp/proximoscampeonatos.html"
            }

            t++
          }
              }
      })
  })
}


//Botão rejeitar
const btnRejeitar = document.getElementsByClassName("rejeitar")
//console.log(campeonato)
for (let i = 0; i < btnRejeitar.length; i++) {
btnRejeitar[i].addEventListener("click", () => {

   //get id trofeu selecionado
  let id_campeonato = btnRejeitar[i].getAttribute("value");
  console.log("O evento selecionado é: " + id_campeonato)


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
        console.log("entrei")
          
          
        console.log("O id selecionado é: " + id_campeonato);

          for(const campeonato of campeonatos){

            if(campeonato.Id == id_campeonato){

              console.log("O id selecionado é: " + campeonato.Id);

              let response = await fetch(`${domain}/admin/rejectChampionship/${campeonato.Id}`)
              const rejeitado = await response.json()

              console.log(rejeitado)
           
            }}
 
    

   // window.location.href="/public/sp/proximoscampeonatos.html"
             
         
          }
     
  })

   
})
}


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



