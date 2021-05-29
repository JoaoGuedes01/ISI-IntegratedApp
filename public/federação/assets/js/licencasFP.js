const domain = "api"
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
    let nascimento
    let codigoP
    let morada
    let cidade
    let nif
    let telemovel
 console.log(licences)

 for (const licence of licences) { 
        strHtml += `
        <tr>
            <td class='w-10 text-center'>SP Modelismo</td>
            <td class='w-10 text-center'>${licence.firstName} ${licence.lastName}</td>   
            <td class='w-10 text-center'>${licence.licenseType} </td>
            <td class='w-10 text-center'>${licence.licenseNumber} </td>    
            <td class='w-10 text-center'>
            <i value='${licence.Id}' class="fas fa-plus more" title="Ver mais"> </i>
              </td>
        </tr>
    `

    strHtml += "</tbody>"
    tblLicences.innerHTML = strHtml


    nascimento = licence.dateOfBirth
    codigoP = licence.postal_code
    morada = licence.Address
    cidade = licence.city
    telemovel = licence.phone_number
    nif = licence.NIF

        i++
    }


            //botão ver mais 
            const btnMore = document.getElementsByClassName("more")
            for (let i = 0; i < btnMore.length; i++) {
             btnMore[i].addEventListener("click", () => {
     
                 //get id licença selecionado
                let id_licence = btnMore[i].getAttribute("value");
                console.log("O evento selecionado é: " + id_licence)
    
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
                    <p>Data de nascimento: ${nascimento.substring(0,10)}</p>
                    <p>NIF: ${nif}</p>
                    <p>Código-Postal: ${codigoP}</p>
                    <p>Morada: ${morada}</p>
                    <p>Cidade: ${cidade}</p>
                    <pTelemóvel: ${telemovel}</p>
                  </div>
                  </div>   
                    
                      </div>
                  </div>
              </div>`
    
              })           
             })
         }

}