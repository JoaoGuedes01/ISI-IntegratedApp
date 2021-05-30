let domain = "http://127.0.0.1:3000/api"
window.onload=() => {

    renderPromocoes();
    }
 

    let tblPromocoes = document.getElementById("tblPromocoes");
    const renderPromocoes = async () => {
        let strHtml = `
        <thead >
        <tr>            
            <th class='w-20 text-center'> Cliente</th> 
            <th class='w-20 text-center'> Nome Evento </th> 
            <th class='w-30 text-center'> Preço Evento</th>  
            <th class='w-30 text-center'> Data inicio do Evento</th> 	
            <th class='w-30 text-center'> Data fim do Evento</th>
            <th class='w-20 text-center'></th>
        </tr>    
        </thead>
        
        <tbody>`

        //verificar data
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;    
    console.log(today)

      const response = await fetch(`${domain}/webcelos/requests`) 
      const promocoes = await response.json()
      let i = 1
      //console.log(promocoes)
      for (const promocao of promocoes) {
                  
      //tem de ser do tipo "cmd"
      //console.log(promocao.summary)

      let parsedSummary = JSON.parse(promocao.summary)

      //console.log(parsedSummary.properties)

      for(let l=0; l<parsedSummary.properties.length;l++){
      
      if(parsedSummary.properties[l]=="cmd"){
        const response2 = await fetch(`${domain}/webcelos/requests/details/${promocao.product_id}`)
        const detalhes = await response2.json()
        //console.log(detalhes)
       // console.log(detalhes.moloni[0])
        for(j=0; j< detalhes.salesforce.length;j++){ 
  
if(detalhes.salesforce[j].StartDate__c > today ){
        
    console.log(today);
       console.log(detalhes.salesforce[j].StartDate__c);
           
            strHtml += `
                <tr>  
                    <td class='w-20 text-center'>SP Modelismo </td> 
                    <td class='w-20 text-center'>${promocao.name}</td>   
                    <td class='w-20 text-center'>${detalhes.salesforce[j].InscPrice__c}</td>
                    <td class='w-20 text-center'>${detalhes.salesforce[j].StartDate__c}</td>
                    <td class='w-20 text-center'>${detalhes.salesforce[j].CloseDate__c}</td>
                    <td class='w-10 text-center'>
                    <i value='${detalhes.salesforce[j].Id}' class="fas fa-upload img" title="Enviar Promoção">
              
                </tr>
            `
            i++
        
        }} }
        strHtml += "</tbody>"
        tblPromocoes.innerHTML = strHtml
    }




    // Gerir o clique no ícone       
 const selectedProm = document.getElementsByClassName('img'); 
for (let i = 0; i < selectedProm.length; i++) {


    selectedProm[i].addEventListener("click", () => {
        let id_evento = selectedProm[i].getAttribute("value");
        //console.log("A promoção selecionada é:" + id_evento)
         Swal.fire({
            
            title: 'Enviar serviço publicitário',
            html:
            `<br>

            <form id="formAnexar">		 
        <div class="col-md-12" >
            <div class="row">
                <div class="col-md-12">
                  <strong> Anexar ficheiro: </strong>
                  <input type="file" id="imagem" accept="image/*">
                </div>
            </div>
        </div>
         
           </form>`, //<input type="file" id="input" onchange="handleFiles(this.files)">
           focusConfirm: false,
           preConfirm: async (event) => {



            let selectedFile  =  document.getElementById("imagem")
           
            
          

//            console.log("foto " + files)

        
                // const fileReader = new FileReader();
                // fileReader.readAsDataURL(files);
                // console.log("foto " + this.result)
            




            //a partir daqui está tudo bem (é só trocar o files)
            const file = new FormData();

            console.log(selectedFile.files)
            file.append('imagem',selectedFile.files[0]);
            

         

            const response = await fetch(`${domain}/webcelos/sendPromLogo/${id_evento}`, {
                  method: 'POST',
                  body: file
                  
            })
            if (response.status == 200) {
                swal.fire('Promoção envia com sucesso','A promoção foi enviada à SPModelismo', 'success')
            }

            
            console.log(response)
            

         }
        })
        
        
        

//            let Id = selectedFile[i].getElementsByClassName('input');
    
//                  console.log(Id);   
//     inputElement.addEventListener("change", handleFiles, false);
//     let fileList = "";
//     function handleFiles(flieList) {
//     fileList = this.files; /* now you can work with the file list */
//     console.log("entrou handleFiles " + fileList);
// }

            
    })
}
    }

        }



