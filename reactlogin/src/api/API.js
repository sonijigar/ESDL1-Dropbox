const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const doSignUp = (payload) =>
    fetch(`${api}/users/doSignUp`,{
        method: 'POST',
        headers:{
            ...headers,
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doWelcome = (payload) =>
    fetch(`${api}/users/doWelcome`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });
export const doLogin = (payload) =>
    fetch(`${api}/users/doLogin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => {
        return res.json();
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });
export const showFiles = (payload) =>
    fetch(`${api}/files/listfiles`,{
        method: 'POST',
        headers:{
            ...headers,
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => {
        return res.json();
    }).catch(error => {
        console.log("This is Error");
        return error;
    });

export const uploadFile = (payload) =>
    fetch(`${api}/files/fileupload`, {
        method: 'POST',
        body: payload
    }).then(res => {
        return res.status;
}).catch(error => {
    console.log("This is error");
return error;
});
