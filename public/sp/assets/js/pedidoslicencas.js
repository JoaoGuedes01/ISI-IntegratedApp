let domain = "https://ISI-IntegratedApp.joaoguedes01.repl.co/api"
window.onload=() => {
    let tblPedidos = document.getElementById("tblPedidos");  
     
    const renderPedidos = async () => {
      
        let strHtml = `
        <thead >
        <tr>
            <th class="serial">#</th>
            <th>ID Compra</th>
            <th>ID Piloto</th>
            <th>Data de solicitação</th>
            <th>Tipo de licença</th>
            <th>Ações</th>
            <th></th>
            </tr>  
        </thead>
        
        <tbody>`

      const response = await fetch(`http://6e7eb50ebbba.ngrok.io/api/...`) 
      const pedidos = await response.json()
      let i = 1
      for (const pedido of pedidos) {
          //console.log(pedidos)
          strHtml += `
              <tr>
              
                  <td class='w-10 text-center'>${pedido.id}</td>
                  <td class='w-20 text-center'>${pedido.b}</td>
                  <td class='w-20 text-center'>${pedido.h}</td>
                  <td class='w-20 text-center'>${pedido.g}</td>
                  <td class='w-10 text-center'>
                      <i id='${pedido.id_material}' class="fas fa-search-plus"> ></i>
                      <i id='${pedido.id_material}' class="fas fa-search-plus"> ></i>   
                      <i id='${pedido.id_material}' class="fas fa-search-plus"> ></i>  
                  </td>
              </tr>
          `
          i++
      }
      strHtml += "</tbody>"
      tblPedidos.innerHTML = strHtml
   } 
    
    renderPedidos();
}




