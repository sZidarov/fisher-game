const logoutBtn = document.getElementById('logout');
logoutBtn.style.display = "none";
logoutBtn.addEventListener("click", logoutFn);
const guestButtons = document.getElementById("guest");
const welcomeTag = document.querySelector('span');
const loadBtn = document.querySelector('aside button');
loadBtn.style.display = "none";
loadBtn.addEventListener("click", loadCatchesFn);
const addBtn = document.querySelector("aside .add");
addBtn.addEventListener("click", addCatchFn);
const addForm = document.getElementById('addForm');
const userDataEmail = localStorage.getItem("email");
const userDataAccessToken = localStorage.getItem("accessToken");
const userDataId = localStorage.getItem("userId");

//console.log(userDataEmail);
if(userDataEmail){
    //hide Login and Register buttons if logged in
    guestButtons.style.display = "none";
    //display logout button if logged in
    logoutBtn.style.display = "block";
    //display LOAD button if logged in
    loadBtn.style.display = "block"
    //display "Welcome, user" if logged in
    welcomeTag.textContent = userDataEmail;
    // enable ADD button if logged in
    addBtn.disabled = false;
};

async function logoutFn(){
    const logoutUrl = 'http://localhost:3030/users/logout';

    await fetch(logoutUrl, {
        method: "GET",
        headers: {"X-Authorization": userDataAccessToken},
    })
    localStorage.clear();
    location = "/05.Fisher-Game/src/index.html";
};

const fieldSet = document.getElementById('main');

async function loadCatchesFn(){
    const loadCatchesUrl = "http://localhost:3030/data/catches";

    await fetch (loadCatchesUrl)
        .then(response => {
            if(response.ok === false){
                throw new Error("Server time out!")
            }
            return response.json();
        })
        .then (data => {
            //console.log(data);
            fieldSet.replaceChildren();
            const legend = document.createElement('legend');
            legend.textContent = "Catches"
            fieldSet.appendChild(legend);
            for (const record of data) {
                //console.log(record);
                //console.log(createCatch(record));
                fieldSet.appendChild(createCatch(record));
            };
        })
};


function createCatch (catchRecord){
    let isOwner = true;
    const inputLibrary = ["Angler","Weight","Species","Location","Bait"];
    const btnLibrary = ["Update", "Delete"];
    if (userDataId === catchRecord._ownerId){
        isOwner = false;
    };
    const catchDiv = document.createElement('div');
    catchDiv.className = "catch";
    //catchDiv.id = catchRecord._id;
   
    inputLibrary.forEach (element => {
        const label = document.createElement('label');
        label.textContent = element;
        
        const input = document.createElement('input');
        if(element === "Weight"){
            input.type = 'number';
            input.value = Number(catchRecord[element.toLowerCase()]);
        }else{
            input.type = 'text';
            input.value = catchRecord[element.toLowerCase()];
        }
        input.className = element.toLowerCase();
        input.disabled = isOwner;

        catchDiv.appendChild(label);
        catchDiv.appendChild(input);
    });

    const cTLabel = document.createElement("label");
    cTLabel.textContent = "Capture Time";
    
    const cTInput = document.createElement('input');
    cTInput.type = 'number';
    cTInput.className = 'captureTime';
    cTInput.value = Number(catchRecord.captureTime);
    cTInput.disabled = isOwner;

    catchDiv.appendChild(cTLabel);
    catchDiv.appendChild(cTInput);

    btnLibrary.forEach(element => {
        const btn = document.createElement("button");
        btn.textContent = element;
        btn.className = element.toLowerCase();
        btn.disabled = isOwner;
        btn.setAttribute('data-id' , catchRecord._id);
        if (element === "Update") {
            btn.addEventListener("click", updateCatchFn);
        }else if(element === "Delete"){
            btn.addEventListener("click", deleteCatchFn);
        };

        catchDiv.appendChild(btn);
    });

    return catchDiv
};

async function addCatchFn(event){
    event.preventDefault();
    const addUrl = "http://localhost:3030/data/catches";
    const formData = new FormData(addForm);
    const getLibrary = ["angler","weight","species","location","bait","captureTime"];
    let postObj = {};
    getLibrary.forEach(input => {
        if(input === "weight" || input === "captureTime"){
            postObj[input] = Number(formData.get(input));
        }else{    
            postObj[input] = formData.get(input);
        }
    })

    //console.log(postObj);

    await fetch(addUrl, {
        method: "POST",
        headers: {"Content-Type": "application/js","X-Authorization": userDataAccessToken},
        body: JSON.stringify(postObj),
    })
    addForm.reset();
    loadCatchesFn();
};

async function deleteCatchFn(event){
    const deleteUrl = "http://localhost:3030/data/catches/";
    const target = event.target;
    const id = target.getAttribute("data-id");
    
    await fetch(deleteUrl + id, {
        method: "DELETE",
        headers: {"X-Authorization": userDataAccessToken},
    });
    loadCatchesFn();
}

async function updateCatchFn(event) {
    const updateUrl = "http://localhost:3030/data/catches/";
    const target = event.target;
    const targetParent = target.parentElement;
    const id = target.getAttribute("data-id");
    const getLibrary = ["angler","weight","species","location","bait","captureTime"];
    //console.log(id);
    //console.log(target.parentElement);
    let putObj = {};
    
    getLibrary.forEach(input => {
        const data = targetParent.querySelector(`.${input}`)
        //console.log(data);
        if(input === "weight" || input === "captureTime"){
            // Number
            putObj[input] = Number(data.value);
        }else{    
            putObj[input] = data.value;
        }
    })

    await fetch (updateUrl + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json", "X-Authorization": userDataAccessToken},
        body: JSON.stringify(putObj),
    })
    loadCatchesFn();
};
