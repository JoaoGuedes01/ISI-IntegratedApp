let domain = "http://127.0.0.1:3000/api"
window.onload=() => {


    renderLicences();
}


//renderLicences
const renderLicences = async () => {

    let tblLicences = document.getElementById("tblListagemLicenca");  

    let strHtml = `
    <thead >
    <tr>
        <th class='w-10 text-center'> Nome</th>              
        <th class='w-10 text-center'> Telefone</th> 
        <th class='w-10 text-center'> Identificação</th>              
        <th class='w-20 text-center'> NIF</th>         
        <th class='w-20 text-center'> Tipo</th>
        <th class='w-10 text-center'> Número</th> 
        <th class='w-10 text-center'> Ver mais</th> 
    </tr>    
    </thead>
    
    <tbody>`

    const response = await fetch(`${domain}/admin/licenses`) 
    const licences = await response.json()
    let i = 0
    let nascimento
    let codigoP
    let morada
    let cidade

    for(const licence of licences){

        strHtml += `
        <tr>
        
            <td class='w-10 text-center'>${licence.First_Name__c} ${licence.Last_Name__c}</td>       
            <td class='w-10 text-center'>${licence.Phone_Number__c}</td>
            <td class='w-20 text-center'>${licence.CC__c}</td>
            <td class='w-10 text-center'>${licence.NIF__c}</td>
            <td class='w-20 text-center'>${licence.License_Type__c}</td>
            <td class='w-10 text-center'>${licence.License_Number__c}</td>
            <td class='w-10 text-center'>
            <i value='${licence.Id}' class="more" title="Ver mais"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQyNi42NjcgNDI2LjY2NyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PHJlY3Qgd2lkdGg9IjQyNi42NjciIGhlaWdodD0iNDI2LjY2NyIgcng9IjIwIiByeT0iMjAiIGZpbGw9IiNlMWUxZTEiIHNoYXBlPSJyb3VuZGVkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcsMCwwLDAuNyw2NC4wMDAwNDg4MjgxMjUwMiw2NC4wMDAwNDg4MjgxMjUwMikiPjwvcmVjdD48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjQyMDAwMDAwMDAwMDAwMDA0LDAsMCwwLjQyMDAwMDAwMDAwMDAwMDA0LDEyMy43MzM0Mjc3MzQzNzUsMTIzLjczMzE0NDUzMTI0OTk4KSI+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSI0Mi42NjciIGN5PSIyMTMuMzMzIiByPSI0Mi42NjciIGZpbGw9IiM2ODY4NjgiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Y2lyY2xlIGN4PSIyMTMuMzMzIiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPGNpcmNsZSBjeD0iMzg0IiBjeT0iMjEzLjMzMyIgcj0iNDIuNjY3IiBmaWxsPSIjNjg2ODY4IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" /></i>  
        </td>
        </tr>
    `

    strHtml += "</tbody>"
    tblLicences.innerHTML = strHtml


    nascimento = licence.Birth_Date__c
    codigoP = licence.Postal_Code__c
    morada = licence.Address__c
    cidade = licence.City__c

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
                    <p>Data de nascimento: ${nascimento}</p>
                    <p>Código-Postal: ${codigoP}</p>
                    <p>Morada: ${morada}</p>
                    <p>Cidade: ${cidade}</p>
                  </div>
                  </div>   
                    
                      </div>
                  </div>
              </div>`
    
              })           
             })
         }

}