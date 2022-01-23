const send_user = document.getElementById("send-user");
const update_user = document.getElementById("update-user");

send_user.addEventListener("click", sendUser);
update_user.addEventListener("click", updateUser);
document.addEventListener('DOMContentLoaded', getUsers);

function getUsers() {
    fetch("https://contact-agenda-rest-api.herokuapp.com/users")
    .then(processResponse)
    .then(renderListItem);
}

function sendUser(event) {
    event.preventDefault();
    
    let contactData = {
        first_name: document.getElementById("firstname").value,
        last_name: document.getElementById("lastname").value,
        mobile: document.getElementById("mobile").value,
        address: {
            street: document.getElementById("street").value,
            number: document.getElementById("number").value,
            city: document.getElementById("city").value,
            country: document.getElementById("country").value,
        }
    };

    fetch("https://contact-agenda-rest-api.herokuapp.com/users", {
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(contactData),
    })
    .then(processResponse)
    .then(renderListItem)
    .then(cleanFormInputs);
}

function processResponse(data) {
    return data.json();
}

function renderListItem(userData) {
    console.log(userData);
    userData = Array.isArray(userData) ? userData : [userData];
    for (let user of userData) {
        const div = document.createElement("div");
        div.className = 'contactbox';
        div.innerHTML = `<div class="editelements">
                <div class="edit">
                    <input type="image" src="pencil.png" style="width: 30px;">
                </div>
                <div class="delete">
                    <input type="image" src="trash-bin.png" style="width: 30px;">
                </div>
            </div>
            <div class="firstlastname contact">
                <img src="approval.png" style="width: 30px;">
                ${user.first_name} ${user.last_name}
            </div>`;
        if (user.mobile) {
            div.innerHTML +=  `<div class="mobile contact">
                    <img src="call.png" style="width: 30px;">
                    ${user.mobile}
                </div>`;
        }
        if (user.address) {
            console.log(user.address);
            let fullAddress = user.address.street;
            if (user.address.number) {
                fullAddress += ' ' + user.address.number;
            }
            if (user.address.city) {
                fullAddress += ', ' + user.address.city;
            }
            if (user.address.country) {
                fullAddress += ', ' + user.address.country;
            }
            if (fullAddress) {
                div.innerHTML +=  `<div class="homeaddres contact">
                        <img src="house.png" style="width: 30px;">
                        ${fullAddress}
                    </div>`;
            }
        }
        const user_list = document.getElementById("user-list");
        user_list.append(div);

        div.querySelector('.delete').addEventListener('click',function() {
            deleteUser(user.id);
        });

        div.querySelector('.edit').addEventListener('click',function() {
            editUser(user);
        });
    }
}

function editUser(userData) {
    document.getElementById("userid").value = userData.id;
    document.getElementById("firstname").value = userData.first_name;
    document.getElementById("lastname").value = userData.last_name;
    document.getElementById("mobile").value = userData.mobile;
    document.getElementById("street").value = userData.address.street;
    document.getElementById("number").value = userData.address.number;
    document.getElementById("city").value = userData.address.city;
    document.getElementById("country").value = userData.address.country;
    send_user.style.display = "none";
    update_user.style.display = "block";
}

function updateUser(event){
    event.preventDefault();

    let userid = document.getElementById("userid").value;

    let contactData = {
        first_name: document.getElementById("firstname").value,
        last_name: document.getElementById("lastname").value,
        mobile: document.getElementById("mobile").value,
        address: {
            street: document.getElementById("street").value,
            number: document.getElementById("number").value,
            city: document.getElementById("city").value,
            country: document.getElementById("country").value,
        }
    };

    fetch("https://contact-agenda-rest-api.herokuapp.com/users/"+userid, {
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(contactData),
    })
    .then(cleanUserList)
    .then(getUsers)
    .then(cleanFormInputs);
}

function deleteUser(userId) {
    fetch("https://contact-agenda-rest-api.herokuapp.com/users/"+userId, {
        method: "DELETE",
    })
    .then(cleanUserList)
    .then(getUsers);
}

function cleanUserList() {
    let elements = document.querySelectorAll('.contactbox');
    for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
}

function cleanFormInputs() {
    document.getElementById("firstname").value = '';
    document.getElementById("lastname").value = '';
    document.getElementById("mobile").value = '';
    document.getElementById("street").value = '';
    document.getElementById("number").value = '';
    document.getElementById("city").value = '';
    document.getElementById("country").value = '';
    send_user.style.display = "block";
    update_user.style.display = "none";
}

