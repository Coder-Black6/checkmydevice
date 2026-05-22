// =====================
// POPUP FUNCTION
// =====================
function showPopup(message){

    // Remove old popup
    const oldPopup =
        document.querySelector(
            ".custom-popup"
        );

    if(oldPopup){
        oldPopup.remove();
    }

    // Create popup
    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "custom-popup";

    popup.innerHTML = `
        <div class="popup-box">
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(
        popup
    );

    // Remove popup
    setTimeout(() => {

        popup.style.opacity =
            "0";

        setTimeout(() => {
            popup.remove();
        }, 300);

    }, 2500);
}


// =====================
// APPWRITE SETUP
// =====================
const client =
    new Appwrite.Client();

client
    .setEndpoint(
        'https://nyc.cloud.appwrite.io/v1'
    )
    .setProject(
        '6a01d2b00029c630be94'
    );

const account =
    new Appwrite.Account(
        client
    );


// =====================
// SIGN UP
// =====================
window.signUp =
async function(){

    const email =
        document.getElementById(
            "email"
        ).value.trim();

    const password =
        document.getElementById(
            "password"
        ).value.trim();

    if(!email || !password){

        showPopup(
            "Please enter email and password ❌"
        );

        return;
    }

    try{

        // Create account
        await account.create(
            Appwrite.ID.unique(),
            email,
            password
        );

        // Auto login
        await account.createEmailSession(
            email,
            password
        );

        showPopup(
            "Account created successfully ✅"
        );

        // Redirect
        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1200);

    }

    catch(error){

        showPopup(
            error.message
        );
    }
};


// =====================
// LOGIN
// =====================
window.login =
async function(){

    const email =
        document.getElementById(
            "email"
        ).value.trim();

    const password =
        document.getElementById(
            "password"
        ).value.trim();

    // Validation
    if(!email || !password){

        showPopup(
            "Please enter email and password ❌"
        );

        return;
    }

    try{

        // Remove old session first
        try{
            await account.deleteSession(
                "current"
            );
        }
        catch(e){
            // Ignore if no session
        }

        // Login with real credentials
        await account
            .createEmailSession(
                email,
                password
            );

        showPopup(
            "Login successful ✅"
        );

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);

    }

    catch(error){

        showPopup(
            error.message
        );
    }
};