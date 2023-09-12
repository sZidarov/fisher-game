const logoutBtn = document.getElementById('logout');
logoutBtn.style.display = "none";

const formEl = document.querySelector('form');
formEl.addEventListener("submit", loginFn);

async function loginFn(event){
    event.preventDefault();

    const loginUrl = "http://localhost:3030/users/login";
    const formData = new FormData(formEl);
    const inputEmail = formData.get("email");
    const inputPass = formData.get("password");

    const response = await fetch(loginUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "email": inputEmail,
            "password": inputPass,
        }),
    });
    //console.log(request);
    try {
            if(response.ok === false){
                formEl.reset();
                const error = await response.json();
                throw error 
            }
            const userData = await response.json();
            localStorage.setItem("email", userData.email);
            localStorage.setItem("accessToken", userData.accessToken);
            localStorage.setItem("userId", userData._id);
            
            //console.log(userData);
            location = "/05.Fisher-Game/src/index.html"
            logoutBtn.style.display = "block";
        
    } catch (error) {
        alert(error.message);
    };
};