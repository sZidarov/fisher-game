const logoutBtn = document.getElementById('logout');
logoutBtn.style.display = "none"

const formEl = document.querySelector('form');
formEl.addEventListener("submit", regFn);


async function regFn(event) {
    event.preventDefault();
    const regUrl = "http://localhost:3030/users/register"
    const formData = new FormData(formEl);
    const emailInput = formData.get("email");
    const passInput = formData.get("password");
    const rePassInput = formData.get("rePass");

    if(emailInput === ''){
        throw alert("Email field required!")
    }
    if (passInput === '') {
        throw alert("Password field required!")
    }
    if (rePassInput !== passInput) {
        throw alert("Passwords don't match!")
    }

    
    try {
        const request = await fetch(regUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "email": emailInput,
                "password": passInput
            })
        })  
        
        if(request.ok === false){
            formEl.reset();
            const error = await request.json();
            throw error;
        }

        const userData = await request.json()
            //console.log(data);
            localStorage.setItem("email", userData.email);
            localStorage.setItem("accessToken", userData.accessToken);
            localStorage.setItem("userId", userData._id);

        location = "http://127.0.0.1:5500/05.Fisher-Game/src/index.html"
    } catch (error) {
        alert(error.message)
    }
    
    
    //console.log(emailInput);
    //console.log(passInput);
    //console.log(rePassInput);
} 