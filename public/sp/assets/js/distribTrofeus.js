let domain = "http://127.0.0.1:3000/api"
let id_trofeu

window.onload=() => {

    //buscar o id do evento
    id_trofeu = getCookie('id_trofeu')
    
    renderInscMangas();

}




  //get inscritos
      //Tabela Inscritos
      let tblMangaA= document.getElementById("tblMangaA"); 
      let tblMangaB= document.getElementById("tblMangaB");  
      let tblMangaC= document.getElementById("tblMangaC");  
      let tblMangaD= document.getElementById("tblMangaD");  
      let tblMangaE= document.getElementById("tblMangaE");   
      const renderInscMangas = async () => {
        const response = await fetch(`${domain}/admin/getMangasByEvent/${id_trofeu}`) 
        const mangas = await response.json()
        let htmlA=`
  
        <thead >
        <tr>             
            <th class='w-20 text-center'> Manga</th>
            <th class='w-10 text-center'> Número</th>            
            <th class='w-20 text-center'> Piloto Name</th>
            <th class='w-10 text-center'> Mais Informações</th>   
            </tr>    
            </thead>
            
            <tbody>`
          // let htmlB=`
  
        //   <thead >
        //     <tr>             
        //         <th class='w-20 text-center'> Manga</th>
        //         <th class='w-10 text-center'> Número</th>            
        //         <th class='w-20 text-center'> Piloto Name</th>
        //         <th class='w-10 text-center'> Mais Informações</th>   
        //         </tr>    
        //         </thead>
                
        //         <tbody>`
        // let htmlC=`
  
        //         <thead >
        //         <tr>             
        //             <th class='w-20 text-center'> Manga</th>
        //             <th class='w-10 text-center'> Número</th>            
        //             <th class='w-20 text-center'> Piloto Name</th>
        //             <th class='w-10 text-center'> Mais Informações</th>   
        //             </tr>    
        //             </thead>
                    
        //             <tbody>`
        

        for( const manga of mangas){
         // if(manga.mangaType__c=="A"){
            htmlA += `
                  <tr>
                      <td class='w-20 text-center'>${manga.mangaType__c}</td>
                      <td class='w-10 text-center'>${manga.mangaPos__c}</td>
                      <td class='w-10 text-center'>${manga.PilotName__c}</td>
                      <td class='w-10 text-center'><i value=${manga.PilotID__c} class="more" title="Ver Dados do inscrito"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC41MSwwLDAsMC41MSwxMDQuNTMzNDEzMDg1OTM3NTMsMTA0LjUzMzE3MzgyODEyNDk3KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiMzODM4MzgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjMzgzODM4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjMzgzODM4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i> 
                      </td>
                      </tr>
                    `
          // // }
          // // if(manga.mangaType__c=="B"){
          // // htmlB += `
          //         <tr>
          //             <td class='w-20 text-center'>${manga.mangaType__c}</td>
          //             <td class='w-10 text-center'>${manga.mangaPos__c}</td>
          //             <td class='w-10 text-center'>${manga.PilotName__c}</td>
          //             <td class='w-10 text-center'></td>
          //             </tr>
          //           `
          // }
          // if(manga.mangaType__c=="C"){
          // htmlC += `
          //         <tr>
          //             <td class='w-20 text-center'>${manga.mangaType__c}</td>
          //             <td class='w-10 text-center'>${manga.mangaPos__c}</td>
          //             <td class='w-10 text-center'>${manga.PilotName__c}</td>
          //             <td class='w-10 text-center'></td>
          //             </tr>
          //           `
          // }
        }
      
  
      htmlA += "</tbody>" 
      // htmlB += "</tbody>" 
      // htmlC += "</tbody>" 
      tblMangaA.innerHTML = htmlA
      // tblMangaB.innerHTML = htmlB
      // tblMangaC.innerHTML = htmlC


      //botão ver mais 
      const btnMore = document.getElementsByClassName("more")
      for (let i = 0; i < btnMore.length; i++) {
       btnMore[i].addEventListener("click", async(event)=> {
       let id_inscrito = btnMore[i].getAttribute("value");
        const response1 = await fetch(`${domain}/admin//registrationByEventID/${id_trofeu}`) 
        const inscritos = await response1.json()
        for (const inscrito of inscritos) {
          if(inscrito.PilotID__c == id_inscrito){
         
           //get id trofeu selecionado
          let id_trofeu = btnMore[i].getAttribute("value");

          swal.fire({
            title: 'Dados do Inscrito',
            html:
            `
            <br>
            <div class="badges">
            <div class="row" id="cards_eventos">
            <div class="col-md-12">
            <div class="card">

            <div class="card-body"> 
            <p> Nome: ${inscrito.Pilot_Name__c} </p>
            <p> Carro: ${inscrito.PilotCar__c} </p>
            <p> Motor: ${inscrito.CarMotor__c} </p>
            <p> Transponder: ${inscrito.CarTransponder__c} </p>
            <p> Rádio: ${inscrito.Radio__c} </p><br>

            <h4>Dados do mecânico</h4> <br>
              <p>Nome: ${inscrito.MechanicName__c}</p>
              <p>Email: ${inscrito.MechanicEmail__c}</p>
              <p>Telefone: ${inscrito.MechanicPhone__c}</p>
              <p>Mesa: ${inscrito.Table__c}</p>
            </div>
            </div>   
              
                </div>
            </div>
        </div>`
          
        })
      }}           
       })
       } }
       
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