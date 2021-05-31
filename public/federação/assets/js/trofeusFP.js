let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {

    renderTrofeus();
}

let tblTrofeus = document.getElementById("tblTrofeus");  
const renderTrofeus = async () => {
      
    let strHtml = `
    <thead class=" text-primary">
        <th class='w-30 text-center'>Organizador</th>
        <th class='w-20 text-center'>Nome</th>
        <th class='w-20 text-center'>Data Início</th>
        <th class='w-20 text-center'>Data Fim</th>
        <th class='w-20 text-center'>Ações</th>
    </thead> <tbody>`

  const response = await fetch(`${domain}/federation/requests`) 
  const trofeu = await response.json()

  ////console.log(trofeu.properties);

  let i = 1
  for (i = 0; i < trofeu.results.length; i++) {   
     if(trofeu.results[i].properties.event_status == "espera_conf"){
        ////console.log(trofeu.results[i]);  
         ////console.log(trofeu.results[i].properties.salesforce_id) 
        strHtml += `
          <tr>
              <td class='w-30 text-center'>SP Modelismo</td>
              <td class='w-20 text-center'>${trofeu.results[i].properties.event_name}</td>
              <td class='w-20 text-center'>${trofeu.results[i].properties.createdate.substring(0,10)}</td>
              <td class='w-20 text-center'>${trofeu.results[i].properties.closedate.substring(0,10)}</td>`


const response2 = await fetch(`${domain}/federation/eventByRequestID/${trofeu.results[i].properties.id}`)
const dadosTrofeus = await response2.json();
////console.log(dadosTrofeus);  
            //   if(dadosTrofeus.salesforce_id == trofeu.results[i].properties.id){
            //    //console.log(dadosTrofeus.Name);
            //    //console.log(dadosTrofeus.body.salesforce_id);
            //   strHtml +=`
            //   <td class='w-30 text-center'>${dadosTrofeus.results[i].properties.}</td>
            //   <td class='w-20 text-center'>${dadosTrofeu.CloseDate__c}</td>
            //   `
           
         
            strHtml +=`
              <td class='w-20 text-center'>
            <i value='${trofeu.results[i].id}' class="fas fa-check aceitar" style="color:#18ce0f"> </i>
            <i value='${trofeu.results[i].id}' class="fas fa-times rejeitar" style="color:#910a1c"> </i> 
            </td>
          </tr>`
         // //console.log(trofeu.results[i].properties.salesforce_id);
    }
}
    strHtml += "</tbody>"
    tblTrofeus.innerHTML = strHtml

// Gerir o clique no ícone de Rejeitar      
const btnDelete = document.getElementsByClassName("rejeitar")   
for (let i = 0; i < btnDelete.length; i++) {
    //console.log('entrou' + btnDelete[i].value)
    btnDelete[i].addEventListener("click", () => {
        swal.fire({
            title: 'Tem a certeza?',
            text: "Não será possível reverter a remoção!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#18ce0f',
            cancelButtonColor: '#910a1c',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Remover'
        }).then(async (result) => {
            if (result.value) {
                let Id = btnDelete[i].getAttribute("value")
                //console.log(Id);
            
        
                    const response = await fetch(`${domain}/federation/requests/update`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'PUT',
                        body: `dealID=${Id}&new_status=rejeitado`      
                      
                    })
                   
               
                }
           renderTrofeus(); 
        })
        renderTrofeus();
    })
}


// Gerir o clique no ícone de Aceitar     
const btnAceitar = document.getElementsByClassName("aceitar")   
for (let i = 0; i < btnAceitar.length; i++) {
    //console.log('entrou' + btnAceitar[i].value)
    btnAceitar[i].addEventListener("click", () => {
        swal.fire({
            title: 'Tem a certeza?',
            text: "O trofeu será aceite!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#18ce0f',
            cancelButtonColor: '#910a1c',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceitar'
        }).then(async (result) => {
            if (result.value) {
                let Id = btnAceitar[i].getAttribute("value")
                //console.log(Id);
            
        
                const response = await fetch(`${domain}/federation/requests/update`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'PUT',
                    body: `dealID=${Id}&new_status=insc_abertas`      
                  
                })
                   
               
                }
               renderTrofeus();
        })
        renderTrofeus();
    })
}

}



