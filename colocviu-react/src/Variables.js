const API_URL = "http://localhost:5082/api/";

const addIstoric = async (userId, descriere) => {
    const response = await fetch( API_URL + "istoric/addIstoric", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "userId": userId,
            "descriere" : descriere
          })
    }).then((response) => response.json());
    console.log(response)
}

const stergeIstoric = async (userId, gameId) => {
    const response = await fetch(API_URL + `istoric/stergeIstoric?userId=${userId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
    console.log(response)
}

const stergeWishlistEntry = async (userId, gameId) => {
    const response = await fetch(API_URL + `wishlist/deleteWishlistEntry?userId=${userId}&gameId=${gameId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
    console.log(response)
    window.location.reload()
}

const stergeWishlistUser = async (userId) => {
    const response = await fetch(API_URL + `wishlist/deleteWishlistUser?userId=${userId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
    console.log(response)
}

const stergeListaPrieteni = async (userId) => {
    const response = await fetch(API_URL + `prieteni/stergeListaPrieteni?userId=${userId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
    console.log(response)
}

const stergeMedalii = async (userId) => {
    const response = await fetch(API_URL + `medalie/deleteMedalii?userId=${userId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
    console.log(response)
}

const stergeColectieUser = async (userId) => {
    const response = await fetch(API_URL + `deleteUserCollection?userId=${userId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
    console.log(response)
}

const stergeInfoUser = (userId) => {
    stergeIstoric(userId)
    stergeWishlistUser(userId)
    stergeListaPrieteni(userId)
    stergeMedalii(userId)
    stergeColectieUser(userId)
}

export const variables={
    API_URL,
    STEAM_API_KEY: "35FE52E19D7EF36461E3E9DFB3D8B931",
    validMail: new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'),
    addIstoric,
    stergeInfoUser,
    stergeWishlistEntry
}