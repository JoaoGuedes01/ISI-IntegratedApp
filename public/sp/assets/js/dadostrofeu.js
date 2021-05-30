let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
let id_trofeu

window.onload=() => {

    //buscar o id do evento
    id_trofeu = getCookie('id_trofeu')
    
    renderInscritos();

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


  //get inscritos
      //Tabela Inscritos
      let tblInscritos = document.getElementById("tblInscritos");  
     
      const renderInscritos = async () => {
        //<th class='w-20 text-center'> Licença</th>
        //            <th class='w-20 text-center'> Cartão</th>
        //<th class='w-20 text-center'> Clube</th> 	
          let strHtml = `
          <thead >
          <tr>
              <th class='w-10 text-center'> Nome</th>              
              <th class='w-20 text-center'> Carro</th>
              <th class='w-10 text-center'> Motor</th> 
              <th class='w-10 text-center'> Transponder</th>              
              <th class='w-20 text-center'> Radio</th>
              <th class='w-10 text-center'> Mecânico</th> 
          </tr>    
          </thead>
          
          <tbody>`
  
        const response = await fetch(`${domain}/admin//registrationByEventID/${id_trofeu}`) 
        const inscritos = await response.json()
        let i = 1
        let mec_name
        let mec_email
        let mec_tel
        let mesa
        for (const inscrito of inscritos) {
            console.log(inscritos)
            strHtml += `
                <tr>
                
                    <td class='w-10 text-center'>${inscrito.Pilot_Name__c}</td>
                    <td class='w-20 text-center'>${inscrito.PilotCar__c}</td>
                    <td class='w-10 text-center'>${inscrito.CarMotor__c}</td>
                    <td class='w-20 text-center'>${inscrito.CarTransponder__c}</td>
                    <td class='w-10 text-center'>${inscrito.Radio__c}</td>
                    <td class='w-10 text-center'>
                        <i value='${inscrito.Name}' class="fas fa-search-plus more"></i>  
                    </td>
                </tr>
            `
          console.log(inscrito.Name)
            i++
        }
        strHtml += "</tbody>"
        tblInscritos.innerHTML = strHtml


        //botão ver mais 
        const btnMore = document.getElementsByClassName("more")
        for (let i = 0; i < btnMore.length; i++) {
         btnMore[i].addEventListener("click", async() => {
           
             //get id trofeu selecionado
            let selecionado = btnMore[i].getAttribute("value");
            console.log("O evento selecionado é: " + id_trofeu)
            for(const inscrito of inscritos){
              if(selecionado == inscrito.Name){
         
            swal.fire({
              title: 'Dados do mecânico',
              html:
              `
              <br>
              <div class="badges">
              <div class="row" id="cards_eventos">
              <div class="col-md-12">
              <div class="card">

        
              <div class="card-body">
                <p>Nome: ${inscrito.MechanicName__c}</p>
                <p>Email: ${inscrito.MechanicEmail__c}</p>
                <p>Telefone: ${inscrito.MechanicPhone__c}</p>
                <p>Mesa: ${inscrito.Table__c}</p>
              </div>
              </div>   
                
                  </div>
              </div>
          </div>`
            
          })}    }      
         })
     }




     } 