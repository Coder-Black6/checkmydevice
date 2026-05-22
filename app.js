document.addEventListener(
"DOMContentLoaded",
function(){

    const modal =
        document.getElementById(
            "authModal"
        );

    const signInBtn =
        document.querySelector(
            ".sign-in-btn"
        );

    const signUpBtn =
        document.querySelector(
            ".sign-up-btn"
        );

    if(signInBtn){
        signInBtn.onclick = () => {
            modal.style.display =
                "flex";
        };
    }

    if(signUpBtn){
        signUpBtn.onclick = () => {
            modal.style.display =
                "flex";
        };
    }

});