

async function register() {
  let data = {
    First_Name__c: document.getElementById("First_Name").value,
    Last_Name__c: document.getElementById("Last_Name").value,
    Email__c: document.getElementById("Email").value,
    Password: document.getElementById("Password").value,
    Rep_Password: document.getElementById("Rep_Password").value,
    Birth_Date__c: document.getElementById("Birth_Date").value
  };
  console.log(data);
  const response = await fetch(`http://127.0.0.1:3000/user/register`, {
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
    });

    window.location.href = "/login"

}




