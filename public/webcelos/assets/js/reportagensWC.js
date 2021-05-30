let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {

    renderReportagem();
    }

   let tblReportagens = document.getElementById("tblReportagens"); 
    const renderReportagem = async () => {
        console.log("entrou renderReportagem")
        let strHtml = `
        <thead >
        <tr>           
        <th class='w-20 text-center'> Cliente</th> 
        <th class='w-20 text-center'> Nome Evento </th> 
        <th class='w-30 text-center'> Preço Evento</th>  
        <th class='w-30 text-center'> Data inicio do Evento</th> 	
        <th class='w-30 text-center'> Data fim do Evento</th>
        </tr>    
        </thead>
        
        <tbody>`

      const response = await fetch(`${domain}/webcelos/requests`)
      const reportagens = await response.json()
      let i = 1
      
      for (const reportagem of reportagens) {

        let parsedSummary = JSON.parse(reportagem.summary)

        console.log(parsedSummary.properties)
  
        for(let l=0; l<parsedSummary.properties.length;l++){
        
        if(parsedSummary.properties[l]=="cvid"){
          const response2 = await fetch(`${domain}/webcelos/requests/details/${reportagem.product_id}`)
          const detalhes = await response2.json()
          console.log(detalhes)
         // console.log(detalhes.moloni[0])
          for(j=0; j< detalhes.salesforce.length;j++){
    
    
         //   console.log(detalhes.moloni[j]);
             
              strHtml += `
                  <tr>  
                      <td class='w-20 text-center'>SP Modelismo </td> 
                      <td class='w-20 text-center'>${reportagem.name}</td> 
                      <td class='w-20 text-center'>${detalhes.salesforce[j].InscPrice__c}</td>
                      <td class='w-20 text-center'>${detalhes.salesforce[j].CloseDate__c}</td>
                      <td class='w-20 text-center'>${detalhes.salesforce[j].StartDate__c}</td>
                
                  </tr>
              `
              i++
          
          }}
          strHtml += "</tbody>"
          tblReportagens.innerHTML = strHtml
        }


    }



 

     /*  //enviar notificação à sp modelismo 
      let btnAceitar = document.getElementById("btnAceitar")
  
      btnAceitar.addEventListener("submit", async (event) => {
          event.preventDefault()
          const aceitar = document.getElementById("btnAceitar").value
        
          let response
              console.log('antesdofetchdedeAceitar')
  
              // Adiciona Pista
              response = await fetch(`api/admin/....`, {
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  body: `T???=${aceitar}`
                }) 
//ACHO Q ESTE POST NÃO É BEM ASSIM 

          renderPistas();

      })

      
    // Gerir o clique no ícone de Aceitar     
    const btnAceitar = document.getElementsByClassName("check")
    for (let i = 0; i < btnAceitar.length; i++) {
        btnAceitar[i].addEventListener("click", () => {
            swal({
                title: 'Tem a certeza?',
                text: "Confirma que aceita realizar a reportagem deste evento?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceitar'
            }).then(async (result) => {
                if (result.value) {
                    let Id_Reportagem = btnAceitar[i].getAttribute("value")
                    try {
                        const response = await fetch(`........./${Id_Reportagem}`, {
                            method: "PUT"
                        })
                        if (response.status == 204) {
                            swal('Sucesso!', 'Notificação enviada!', 'success')
                        }
                    } catch (err) {
                        swal({
                            type: 'error',
                            title: 'Erro',
                            text: err
                        })
                    }
                   renderReportagem()
                }
            })
             renderReportagem()
        })
    }


     // Gerir o clique no ícone de Rejeitar      
     const btnDelete = document.getElementsByClassName("times")
     for (let i = 0; i < btnDelete.length; i++) {
         btnDelete[i].addEventListener("click", () => {
             swal({
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
                     let Id_Reportagem = btnDelete[i].getAttribute("value")
                     try {
                         const response = await fetch(`........./${Id_Reportagem}`, {
                             method: "PUT"
                         })
                         if (response.status == 204) {
                             swal('Rejeitado!', 'O evento foi rejeitado!', 'success')
                         }
                     } catch (err) {
                         swal({
                             type: 'error',
                             title: 'Erro',
                             text: err
                         })
                     }
                    renderReportagem()
                 }
             })
              renderReportagem()
         })
     } */
  } 
