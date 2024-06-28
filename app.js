// template_l9m6vhb
// service_l01i4fh
// sZwAMDn0LIKJbgo_J

let contrastToggle = false;
function toggleContrast(){
    contrastToggle = !contrastToggle;
    document.body.classList += " dark-theme";

    if(contrastToggle){
        document.body.classList += " dark-theme";
    }else{
        document.body.classList.remove("dark-theme")
    }
}

function contact(event){
    event.preventDefault();
    const loading = document.querySelector('.modal__overlay--loading')
    const success = document.querySelector('.modal__overlay--succes')
    loading.classList += " modal__overlay--visible";


    emailjs.sendForm(
        'service_l01i4fh',
        'template_l9m6vhb',
        event.target,
        'sZwAMDn0LIKJbgo_J'
    ).then(() =>{
        loading.classList.remove('modal__overlay--visible')
        success.classList += " modal__overlay--visible"
    }).catch(() =>{
        loading.classList.remove('modal__overlay--visible')
        alert(
            "The email service is temporarily unavailable. Please contact me directly on kasingh@udel.edu."
        )

    })
}

let isModalOpen = false;
function toggleModal(){
    if(isModalOpen){
        isModalOpen = false;
        return document.body.classList.remove("modal--open")
    }
    isModalOpen = true;
    document.body.classList += " modal--open";
}