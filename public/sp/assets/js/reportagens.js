let domain = "api"
window.onload=() => {
  
    renderPromocoes();

}    
   let tblPromocoes = document.getElementById("tblReportagens");  

    const renderPromocoes = async () => {
        
        let strHtml = `
        <thead >
            <tr>
            <th class='w-10 text-center'>Nome Evento</th>
            <th class='w-10 text-center'>Data Inicio</th>
            <th class='w-10 text-center'>Data Fim</th>
            <th class='w-10 text-center'>Preço</th>

            </tr>   
        </thead>
        
        <tbody>`

            const response = await fetch(`${domain}/admin/woRequests`) 
            const promocoes = await response.json()      


      let i = 1
      for (const promocao of promocoes) {
        let parsedSummary = JSON.parse(promocao.Campanha__c)

        for(let l=0; l<parsedSummary.properties.length;l++){
            console.log(parsedSummary.properties)

        //console.log(parsedSummary.properties)
        if(parsedSummary.properties[l]=="cvid"){

            const response = await fetch(`${domain}/admin/eventById/${promocao.Reference__c}`) 
            const evento = await response.json()   
    
    
            if(evento != ""){
              
            strHtml += `
            <tr>
            <td class='w-10 text-center'>${evento[0].EventName__c}</td>
                <td class='w-10 text-center'>${evento[0].StartDate__c}</td>
                <td class='w-10 text-center'>${evento[0].CloseDate__c}</td>
                <td class='w-10 text-center'>${promocao.Price__c}€</td>
    
            </tr>
           `
            }
        i++
          }
          strHtml += "</tbody>"
          tblPromocoes.innerHTML = strHtml

        }

    }

   } 
 




