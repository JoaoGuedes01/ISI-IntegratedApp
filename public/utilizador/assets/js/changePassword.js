let secret
let pilotID
let domain = "http://127.0.0.1:3000/api"

window.onload=() => {
  secret = window.location.href.split('/')[4]
  pilotID = window.location.href.split('/')[5]
  console.log('secret: '+ secret);
  console.log('userID: '+ pilotID);
}

async function resetPassword(){
  
    let data = {
      password: document.getElementById("password_input").value,
      repPass: document.getElementById("password_input2").value
    };
    console.log(data);
  
    const response = await fetch(`${domain}/user/changePassword/`+secret+`/`+pilotID, {
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
        console.log(data);

        if(data.status==200){
            Swal.fire({
                title: "Sucesso",
                text: "A sua password foi alterada!"
              })
        }
      });
  
  
  
      
  }













//COOCKIES
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function deleteCookie(name) { setCookie(name, '', -1); }
  
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }