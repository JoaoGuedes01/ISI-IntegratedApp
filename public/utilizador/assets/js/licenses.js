let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
let id_user_logged
let licence_logged=null


window.onload=() => {

     
  //  renderLicences();
    LoggedUser();
    
    
}

  //pedir licença

  async function pedir() {

    //verificar dados obrigatórios
    const response = await fetch(`${domain}/user/${id_user_logged}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        method: 'GET',
        credentials: 'include'
    })
    const dados = await response.json()


    //verificar se já tem uma licença
    // if(dados.License_Number__c == null){


            //verificar se há dados null
            if(dados.NIF__c ==null || dados.Phone_Number__c==null || dados.City__c==null || dados.Address__c==null || dados.Postal_Code__c ==null || 
                dados.Identifier__c==null || dados.Identifier_Name__c==null){
                

                    await swal.fire({
                        title: 'Alerta',
                        text: "Para pedir a licença tem de preencher todos os dados",
                        focusConfirm: false,
                        preConfirm: async (event) => {
                            await swal.fire({
                                title: 'Dados pessoais',
                                html:
                                `<br>
                  
                                <form id="formPreencherDados">
                                <div class="form-group row">		 
                               
                          
                               <div class="col-md-12" >
                                    <div class="row">
                                    <div class="col-md-12">
                                      <strong> Informação Pessoal </strong>
                                  </div>
                                  </div>
                  
                  
                                   <div class="row">
                                       <div class="col-md-6"><label for="nome" class=" form-control-label">Nome</label>
                                       <input type="text" id="nome" placeholder="Nome próprio" value=${dados.First_Name__c} class="form-control" required> </div>   
                                       <div class="col-md-6"><label for="apelido" class=" form-control-label">Apelido </label>
                                       <input type="text" id="apelido" placeholder="Motor do carro" value=${dados.Last_Name__c} class="form-control" required> </div>  
                                    </div>
                          
                                    <br>


                                    <div class="row">
                                    <div class="col-md-6"><label for="nascimento" class=" form-control-label">Data de nascimento</label>
                                    <input type="date" id="nascimento" placeholder="Data de nascimento" class="form-control" value=${dados.Birth_Date__c} required> </div>   
                                    <div class="col-md-6"><label for="nif" class=" form-control-label">NIF </label>
                                    <input type="text" id="nif" placeholder="NIF" class="form-control" value="${dados.NIF__c}" required> </div>  
                                 </div>
                       

                              <br>
                              <br>



                              <div class="col-md-12" >
                              <div class="row">
                              <div class="col-md-12">
                                <strong> Identificação </strong>
                            </div>
                            </div>
        
                            <div class="row">
                            <div class="col-md-6"><label for="identifier" class=" form-control-label" >Nº Identificação</label>
                            <input type="text" id="identifier" placeholder="Nº cartão de cidadão" class="form-control" value="${dados.Identifier__c}" required> </div>
                            <div class="col-md-6"><label for="nome_identifier" class=" form-control-label">Nome</label>
                            <input type="text" id="nome_identifier" placeholder="Nome do cartão de cidadão" class="form-control" value="${dados.Identifier__c}" required> </div>     
                           </div>

                           <br>
                           <br>
                  
                              <div class="col-md-12" >
                              <div class="row">
                              <div class="col-md-12">
                                <strong> Contactos </strong>
                            </div>
                            </div>
                  
                  
                  
                           <div class="row">
                           <div class="col-md-6"><label for="email" class=" form-control-label" >Email</label>
                           <input type="text" id="email" placeholder="Email" class="form-control" value="${dados.Email__c}" required> </div>
                           <div class="col-md-6"><label for="telefone" class=" form-control-label">Contacto</label>
                           <input type="text" id="telefone" placeholder="Telemóvel" class="form-control" value="${dados.Phone_Number__c}" required> </div>     
                          </div>
                          
                          <br>
                          <br>


                          <div class="col-md-12" >
                          <div class="row">
                          <div class="col-md-12">
                            <strong> Morada </strong>
                        </div>
                        </div>
              
                        <div class="row">
                        <div class="col-md-12"><label for="morada" class=" form-control-label" >Morada</label>
                        <input type="text" id="morada" placeholder="Morada" class="form-control" value="${dados.Address__c}" required> </div>
                       </div>             
              
                       <br>
                       <div class="row">
                       <div class="col-md-6"><label for="codigo" class=" form-control-label" >Código-Postal</label>
                       <input type="text" id="codigo" placeholder="Código-postal" class="form-control" value=" ${dados.Postal_Code__c}" required> </div>
                       <div class="col-md-6"><label for="cidade" class=" form-control-label">Cidade</label>
                       <input type="text" id="cidade" placeholder="Cidade" class="form-control" value="${dados.City__c}" required> </div>     
                      </div>
                      

                                    <br>      
                               <hr>
                               
                          
                             </div>
                             
                               </form>`,
                                focusConfirm: false,
                                preConfirm: async (event) => {
                                    let contacto =  document.getElementById("telefone").value
                                    let cc= document.getElementById("identifier").value
                                    let cc_name= document.getElementById("nome_identifier").value
                                    let nif= document.getElementById("nif").value
                                    let postal= document.getElementById("codigo").value
                                    let morada = document.getElementById("morada").value
                                    let cidade = document.getElementById("cidade").value
                                    

                                    //verificar se todos os campos estão preenchidos
                                    // console.log(document.getElementById("telefone").value +";" + document.getElementById("identifier").value +";" +
                                    // document.getElementById("nome_identifier").value +";" +   document.getElementById("nif").value+";" +
                                    // document.getElementById("codigo").value+";" +
                                    // document.getElementById("morada").value+";" +
                                    // document.getElementById("cidade").value
                                    // )
                                    
                                    if(document.getElementById("telefone").value !==null && document.getElementById("identifier").value!==null && 
                                    document.getElementById("nome_identifier").value!==null && document.getElementById("nif").value!==null && 
                                    document.getElementById("codigo").value !==null && document.getElementById("morada").value!==null && 
                                    document.getElementById("cidade").value!==null){

                                        await swal.fire({
                                            title: 'Tipo de licença',
                                            html:`
                                            <input type="radio" id="lazer" name="tipo" value="lazer">
                                            <label for="lazer">Lazer</label><br>
                                            <input type="radio" id="nacional" name="tipo" value="nacional">
                                            <label for="nacional">Nacional</label><br>
                                            `,
                                            focusConfirm: false,
                                            preConfirm: async (event) =>{
                                                let tipo
                                                if (document.getElementById('lazer').checked) {
                                                   tipo = document.getElementById('lazer').value;
                                                  }
                        
                                                  if (document.getElementById('nacional').checked) {
                                                    tipo = document.getElementById('nacional').value;
                                                   }
                        
                                                //console.log(tipo)


                                                let data = {
                                                    Phone_Number__c:  contacto,
                                                    CC__c: cc,
                                                    Identifier_Name__c: cc_name,
                                                    NIF__c: nif,
                                                    Postal_Code__c: postal,
                                                    Address__c: morada,
                                                    City__c: cidade,
                                                    License_Type__c: tipo
                                                }
            
                                                //console.log(data)
            
            
                                                const response = await fetch(`${domain}/user/requestLicense`, {
                                                    headers: {
                                                      'Content-Type': 'application/json',
                                                      'Accept': 'application/json'
                                                    },
                                                    mode: 'cors',
                                                    method: 'POST',
                                                    body: JSON.stringify(data),
                                                    credentials: 'include'
                                                  }).then(res => res.json())
                                                    .then(data => {
                                                      //console.log(data);
                                                      window.open(data.forwardLink)

                                                    });

                                                
                                            }
                                        }) 



                                    }

                                    else{
                                        //console.log("algo está mal")
                                    }
                        
                                }
                            })

                
                        }
                    })

            }

            else{
                await swal.fire({
                    title: 'Tipo de licença',
                    html:`
                    <input type="radio" id="lazer" name="tipo" value="lazer">
                    <label for="lazer">Lazer</label><br>
                    <input type="radio" id="nacional" name="tipo" value="nacional">
                    <label for="nacional">Nacional</label><br>
                    `,
                    focusConfirm: false,
                    preConfirm: async (event) =>{
                        let tipo
                        if (document.getElementById('lazer').checked) {
                           tipo = document.getElementById('lazer').value;

                           if(licence_logged!==null){
                           //verificar se já tem licença de lazer 
                           if(licence_logged=="nacional"){
                            swal.fire({
                              title: 'Tipo de licença',
                              text:"Já tem uma licença nacional, não pode adquirir licença de lazer"
                            })
                           }
                          }

                           else{
                            //console.log(tipo)

                            let data = {
                                Phone_Number__c:  dados.Phone_Number__c,
                                CC__c: dados.Identifier__c,
                                Identifier_Name__c: dados.Identifier_Name__c,
                                NIF__c: dados.NIF__c,
                                Postal_Code__c: dados.Postal_Code__c,
                                Address__c:  dados.Address__c,
                                City__c: dados.City__c,
                                License_Type__c: tipo
                            }
    
                            //console.log(data)
    
                            const response = await fetch(`${domain}/user/requestLicense`, {
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Accept': 'application/json'
                                },
                                mode: 'cors',
                                method: 'POST',
                                body: JSON.stringify(data),
                                credentials: 'include'
                              }).then(res => res.json())
                                .then(data => {
                                  //console.log(data);
                                  window.open(data.forwardLink)
                                 
                                });

                           }

                          }

                          if (document.getElementById('nacional').checked) {
                            tipo = document.getElementById('nacional').value;
                            //console.log(tipo)

                            let data = {
                                Phone_Number__c:  dados.Phone_Number__c,
                                CC__c: dados.Identifier__c,
                                Identifier_Name__c: dados.Identifier_Name__c,
                                NIF__c: dados.NIF__c,
                                Postal_Code__c: dados.Postal_Code__c,
                                Address__c:  dados.Address__c,
                                City__c: dados.City__c,
                                License_Type__c: tipo
                            }
    
                            //console.log(data)
    
                            const response = await fetch(`${domain}/user/requestLicense`, {
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Accept': 'application/json'
                                },
                                mode: 'cors',
                                method: 'POST',
                                body: JSON.stringify(data),
                                credentials: 'include'
                              }).then(res => res.json())
                                .then(data => {
                                  //console.log(data);
                                  window.open(data.forwardLink)
                                 
                                });
                           }


                    }
                    
                                            
                }) 
            }
      
  }






//get user logado
const LoggedUser = async () =>{

    ////console.log("ola")
  
    const resposne = await fetch(`${domain}/user/loggedUser`, {
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        method: 'GET',
        credentials: 'include'
    }).then(res => res.json())
            .then(data => {
                //console.log(data)
                id_user_logged =data.Id;
  
                //console.log(data.License_Number__c)

                if(data.License_Number__c =="no license"){
                  //console.log("não tem licença")
                  document.getElementById("cards_licenças").innerHTML += `
  
                  <div class="col-md-4">
                  <div class="card">
                  <div class="card-header">
                  <strong>Licença Atual</strong>
                  </div>
                      <div class="card-body">
                  <p>Não tem nenhuma licença</p>
        
              
                  </p>
                </div>
                </div>   
              
              
                    `    
                }
                else{
                  renderLicences();
                }
            });
  }






//Render Licences
let card_trofeus = document.getElementById("cards_licenças");
const renderLicences = async () =>{
    //console.log("entrou")


    //verificar obter id licença
    const response2= await fetch(`${domain}/user/loggedLicense`,{
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        method: 'GET',
        credentials: 'include'
    }).then(res => res.json())
    .then(data => {
        //console.log(data)

        if(data.status!==404){
        document.getElementById("cards_licenças").innerHTML += `
  
        <div class="col-md-4">
        <div class="card">
        <div class="card-header">
        <strong>Licença Atual</strong>
        </div>
            <div class="card-body">
        <p>Tipo: ${data.License_Type__c}</p>
        <p>Número de Licença: ${data.License_Number__c}</p>
    
        </p>
      </div>
      </div>   
    
    
          `
      licence_logged=data.License_Type__c
        }

    });

    // const licence = await response.json()
    // //console.log(licence)



  }

  







