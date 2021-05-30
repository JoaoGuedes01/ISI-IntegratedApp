let domain = "http://127.0.0.1:3000/api"
window.onload=() => {


    renderLicences();
}


//renderLicences
const renderLicences = async () => {

    let tblLicences = document.getElementById("tblLicenças");  

    let strHtml = `
    <thead >
    <tr>
        <th class='w-10 text-center'> Vendido por</th> 
        <th class='w-10 text-center'> Nome</th>                      
        <th class='w-20 text-center'> Tipo</th>
        <th class='w-10 text-center'> Número</th> 
        <th class='w-10 text-center'> Ver mais</th> 
    </tr>    
    </thead>
    
    <tbody>`

    const response = await fetch(`${domain}/federation/licenses`) 
    const licences = await response.json()
    let i = 0


 for (const licence of licences) { 

        strHtml += `
        <tr>
            <td class='w-10 text-center'>SP Modelismo</td>
            <td class='w-10 text-center'>${licence.firstName} ${licence.lastName}</td>   
            <td class='w-10 text-center'>${licence.licenseType} </td>
            <td class='w-10 text-center'>${licence.licenseNumber} </td>    
            <td class='w-10 text-center'>
            <i value='${licence._id}' class="fas fa-plus more" title="Ver mais"> </i>
              </td>
        </tr>
    `

    strHtml += "</tbody>"
    tblLicences.innerHTML = strHtml


        i++
    }


            //botão ver mais 
            const btnMore = document.getElementsByClassName("more")
            for (let i = 0; i < btnMore.length; i++) {
             btnMore[i].addEventListener("click", async(event)=> {
     
                 //get id licença selecionado
                let id_licence = btnMore[i].getAttribute("value");
                console.log("O evento selecionado é: " + id_licence)
                const response7 = await fetch(`${domain}/federation/licenses/${id_licence}`) 
                const dados = await response7.json();
                swal.fire({
                  title: 'Outros dados',
                  html:
                  `
                  <br>
                  <div class="badges">
                  <div class="row" id="">
                  <div class="col-md-12">
                  <div class="card">
    
            
                  <div class="card-body">
                    <p>Data de nascimento: ${dados[0].dateOfBirth.substring(0,10)}</p>
                    <p>NIF: ${dados[0].NIF}</p>
                    <p>Código-Postal: ${dados[0].postal_code}</p>
                    <p>Morada: ${dados[0].Address}</p>
                    <p>Cidade: ${dados[0].city}</p>
                    <pTelemóvel: ${dados[0].phone_number}</p>
                  </div>
                  </div>   
                    
                      </div>
                  </div>
              </div>`
    
              })           
             })
         }

}