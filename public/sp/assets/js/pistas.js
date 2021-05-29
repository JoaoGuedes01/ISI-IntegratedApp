let domain = "api"
let lat
let long


window.onload = () => {

    let tblPistas = document.getElementById("tblPistas");

    renderPistas();


}



//criar pista
let formAddPista = document.getElementById("formAddPista")

formAddPista.addEventListener("submit", async (event) => {
    event.preventDefault()
    const nome = document.getElementById("nome_pista").value
    const local = document.getElementById("localizaçao_pista").value
    const categoria = document.getElementById("categoria").value
    const estado = document.getElementById("estado").value
    const mesas = document.getElementById("mesas").value
    const capacidade = document.getElementById("capacidade").value
   // const latitude = document.getElementById("map").value
    console.log("latitude da pista"+lat);
    console.log("longitude da pista"+long);
    //console.log('depoisss' + map.position);
    let arraymesas = []


     for (i = 0; i < mesas; i++) {
         let m = i+1

        let jsonMesa = {
            tableNumber: m.toString(),
            capacity: capacidade
        }
        arraymesas.push(jsonMesa)
    }

    let data = {
        TrackName__c: nome,
        TrackLocal__c: local,
        TrackRank__c: categoria,
        TrackCondition__c: estado,
        MapsLat__c: lat,
        MapsLong__c: long,
        tables: arraymesas
    }
    console.log(data);

    let response
    console.log('antesdofetchdeAdd')

    // Adiciona Pista
    response = await fetch(`${domain}/admin/tracks`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
    })

   window.location.href = "/public/sp/pistas.html"

})


const renderPistas = async () => {
    let strHtml = `
            <thead >
            <tr>            
                <th class='w-20 text-center'> Nome</th>   
                <th class='w-20 text-center'> Estado</th>
                <th class='w-20 text-center'> Localização</th>
                <th class='w-20 text-center'> Categoria</th> 
                <th class='w-20 text-center'> Ação</th> 
            </tr>    
            </thead>
            
            <tbody>`

    const response = await fetch(`${domain}/admin/tracks`)
    const pistas = await response.json()
    let i = 1
    for (const pista of pistas) {
        console.log(pistas)
        strHtml += `
                  <tr>
                  
                      <td class='w-20 text-center'>${pista.TrackName__c}</td>
                      <td class='w-20 text-center'>${pista.TrackCondition__c}</td>
                      <td class='w-20 text-center'>${pista.TrackLocal__c}</td>
                      <td class='w-20 text-center'>${pista.TrackRank__c}</td>
                      <td class='w-20 text-center'>
                      <i value='${pista.Id}' class='fas fa-trash-alt apagar' style="color:#f38b03"></i>
                      </td>
    
                  </tr>
              `
        i++
    }
    strHtml += "</tbody>"
    tblPistas.innerHTML = strHtml

    // Gerir o clique no ícone de Rejeitar      
    const btnDelete = document.getElementsByClassName("apagar")
    for (let i = 0; i < btnDelete.length; i++) {
        console.log('entrou' + btnDelete[i].value)
        btnDelete[i].addEventListener("click", () => {
            swal.fire({
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
                    let Id = btnDelete[i].getAttribute("value")

                    try {
                        const response = await fetch(`${domain}/admin/delTrack/${Id}`, {
                            method: "DELETE"
                        })
                        if (response.status == 204) {
                            swal('Rejeitado!', 'A pista foi rejeitada!', 'success')
                        }
                    } catch (err) {
                        swal({
                            type: 'error',
                            title: 'Erro',
                            text: err
                        })
                    }
                    renderPistas()
                }
            })
            renderPistas()
        })
    }
}


function initMap() {
            
    const myLatlng = { lat: 41.545, lng: -8.426 };
              
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: myLatlng,
    });

    // Creation of a marker
    var marker = new google.maps.Marker({
      map,
      title: "Pista",
    });

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {

      var latlng = mapsMouseEvent.latLng;

      marker.setPosition(latlng);

      marker.setAnimation(google.maps.Animation.DROP);

      var position = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
      lat = position.substring(position.indexOf(':')+2, position.indexOf(','));
      long = position.substring(position.indexOf('g')+4, position.indexOf('}')-1);
        console.log(lat);
        console.log(long);
        console.log(position); //lat: xxx e lng: xxx

    });
        

  }
 
console.log(position);


