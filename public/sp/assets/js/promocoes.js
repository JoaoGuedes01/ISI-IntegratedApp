let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {
  
    renderPromocoes();

}    
   let tblPromocoes = document.getElementById("tblPromocoes");  

    const renderPromocoes = async () => {


 //verificar data
 var today = new Date();

 var dd = String(today.getDate()).padStart(2, '0');
 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
 var yyyy = today.getFullYear();
 
 today = yyyy + '-' + mm + '-' + dd;          
     
 console.log(today)

        
        let strHtml = `
        <thead >
            <tr>
            <th class='w-10 text-center'>Nome Evento</th>
            <th class='w-10 text-center'>Data Inicio</th>
            <th class='w-10 text-center'>Data Fim</th>
            <th class='w-10 text-center'>Preço</th>
            <th class='w-10 text-center'>Publicação</th>
            <th class='w-10 text-center'>Estado</th>
            </tr>   
        </thead>
        
        <tbody>`

            const response = await fetch(`${domain}/admin/woRequests`) 
            const promocoes = await response.json()      
            //console.log(promocoes)


      let i = 1
      for (const promocao of promocoes) {

        let parsedSummary = JSON.parse(promocao.Campanha__c)


     

        for(let l=0; l<parsedSummary.properties.length;l++){
            //console.log(parsedSummary.properties)

        //console.log(parsedSummary.properties)
        if(parsedSummary.properties[l]=="cmd"||parsedSummary.properties[l]=="cmd,cvid"){

            const response = await fetch(`${domain}/admin/eventById/${promocao.Reference__c}`) 
            const evento = await response.json()   
    
    
            if(evento != ""){
              
           if(evento[0].EventStatus__c == "insc_abertas" || evento[0].EventStatus__c == "insc_fechadas"){

            strHtml += `
            <tr>
            <td class='w-10 text-center'>${evento[0].EventName__c}</td>
                <td class='w-10 text-center'>${evento[0].StartDate__c}</td>
                <td class='w-10 text-center'>${evento[0].CloseDate__c}</td>
                <td class='w-10 text-center'>${promocao.Price__c}€</td>
 
                <td class='w-10 text-center'>
                <i class="far fa-file-image imagem" value='${evento[0].Id}'></i>
            </td>`
       
       if(evento[0].Published__c == "yes"){
       strHtml +=`
            <td class='w-20 text-center'><span class="badge badge-success"> Publicado </span></td>
            </tr>  `
            }
            else{ strHtml +=`
            <td class='w-20 text-center'><span class="badge badge-pending"> Por Publicar </span></td>
            </tr>  `}

           }


            }
        i++
          }
          // const response3 = await fetch(`${domain}/admin/event`) 
            // const eventoss = await response3.json()  
            // for (const eventos of eventoss) {
            //     strHtml += ` 
          strHtml += "</tbody>"
          tblPromocoes.innerHTML = strHtml

        }



    }


   
// //gerir o botão de ver a imagem 
// const btnImage = document.getElementsByClassName("imagem")

// for (let i = 0; i < btnImage.length; i++) {
   
//  btnImage[i].addEventListener("click",async(event)=> {
//     const id_promocao = btnImage[i].getAttribute("value")
//     // window.open(`${domain}/img/events/${id_promocao}.png`)
//     //  const response5 = await fetch(`${domain}/img/events/${id_promocao}.png`)
//     //  const foto = await response5.json();
     
//     Swal.fire({
//         imageUrl: `http://127.0.0.1:3000/img/events/${id_promocao}.png`,
//         imageAlt: 'Promoção',
//         showCancelButton: true,
//         confirmButtonColor: '#28a745',
//         cancelButtonColor: '#d33',
//         cancelButtonText: 'Cancelar',
//         confirmButtonText: 'Publicar'
//     }).then(async (result) => {
//      swal.fire({
//         title: 'Tem a certeza?',
//         text: "Será feita uma publicação no Facebook e no Twitter!",
//         type: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#28a745',
//         cancelButtonColor: '#d33',
//         cancelButtonText: 'Cancelar',
//         confirmButtonText: 'Publicar'
//     })}).then(async (result) => {
//                 const response = await fetch(`${domain}/admin/publishEventFB/${id_promocao}`)
//                 const response2 = await fetch(`${domain}/admin/publishEventTwitter/${id_promocao}`)

//                 if (response.status == 200 && response2.status == 200) {
//                     swal.fire('Publicado', 'Publicação efetuada com sucesso!', 'success')
//                 }
//     })     
//       })
     
// }
const btnImage = document.getElementsByClassName("imagem")

for (let i = 0; i < btnImage.length; i++) {
   
 btnImage[i].addEventListener("click",async(event)=> {
    const id_promocao = btnImage[i].getAttribute("value")
    // window.open(`${domain}/img/events/${id_promocao}.png`)
    //  const response5 = await fetch(`${domain}/img/events/${id_promocao}.png`)
    //  const foto = await response5.json();
Swal.mixin({
  
  }).queue([
    {imageUrl: `https://ISI-IntegratedApp.joaoguedes01.repl.co/img/events/${id_promocao}.png`,
    imageAlt: 'Promoção',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Publicar'},
    {
        title: 'Tem a certeza?',
        text: "Será feita uma publicação no Facebook e no Twitter!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Publicar'
    }
   
  ]).then(async(result) => {
    if (result.value) {
        const response = await fetch(`${domain}/admin/publishEventFB/${id_promocao}`)
                const response2 = await fetch(`${domain}/admin/publishEventTwitter/${id_promocao}`)


                if (response.status == 200 && response2.status == 200) {
                    swal.fire('Publicado', 'Publicação efetuada com sucesso!', 'success')
                }
            }
      })
    })
  }
   } 
 




