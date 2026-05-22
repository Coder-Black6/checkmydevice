const client = new Appwrite.Client();

client
    .setEndpoint(
        'https://nyc.cloud.appwrite.io/v1'
    )
    .setProject(
        '6a01d2b00029c630be94'
    );

const account =
    new Appwrite.Account(client);


// Check session
account.get()
.then((user) => {

    console.log(user);

})
.catch(() => {

    window.location.href =
        "index.html";

});

// =====================
// LOGOUT FUNCTION
// =====================
window.logout = async function(){

    try{

        await account.deleteSession(
            "current"
        );

        // Nice popup
        const popup =
            document.getElementById(
                "popup"
            );

        const title =
            document.getElementById(
                "popupTitle"
            );

        const content =
            document.getElementById(
                "popupContent"
            );

        popup.style.display =
            "flex";

        title.innerText =
            "Logout";

        content.innerText =
            "Logged out successfully ✅";

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1200);

    }

    catch(error){

        alert(
            error.message
        );
    }
};

document.addEventListener("DOMContentLoaded", function(){

    const popup = document.getElementById("popup");
    const title = document.getElementById("popupTitle");
    const content = document.getElementById("popupContent");
    const closeBtn = document.getElementById("closeBtn");

    // OPEN POPUP
    function openPopup(t, c){
        popup.style.display = "flex";
        title.innerText = t;
        content.innerText = c;
    }

    // CLOSE POPUP
    if(closeBtn){
        closeBtn.onclick = () => {
            popup.style.display = "none";
        };
    }

    // LOCATION FUNCTION
    window.getLocation = function(){

        // Check support
        if (!navigator.geolocation) {
            openPopup("Error", "Geolocation not supported on this device");
            return;
        }

        // Loading message
        openPopup("📍 Getting Location...", "Please allow permission...");

        navigator.geolocation.getCurrentPosition(

            // SUCCESS
            function(position){
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                openPopup("📍 Getting Address...", "Please wait...");

                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                .then(response => response.json())
                .then(data => {

                    const address = data.address;

                    const niceAddress = `
${address.road || ""}
${address.city || address.town || address.village || ""}
${address.state || ""}
${address.country || ""}
                    `;

                    openPopup(
                        "📍 Your Location",
                        niceAddress
                    );
                })
                .catch(() => {
                    openPopup(
                        "📍 Your Location",
                        `Latitude: ${lat}, Longitude: ${lon}`
                    );
                });
            },

            // ERROR
            function(error){
                let message = "Unable to get location";

                if(error.code === error.PERMISSION_DENIED){
                    message = "Permission denied ❌";
                } 
                else if(error.code === error.POSITION_UNAVAILABLE){
                    message = "Location unavailable";
                } 
                else if(error.code === error.TIMEOUT){
                    message = "Request timed out";
                }

                openPopup("Error", message);
            }

        );
    };

window.getBattery = function(){

    // Check support
    if(!navigator.getBattery){
        openPopup("Battery", "Battery info not supported on this device ❌");
        return;
    }

    openPopup("🔋 Checking Battery...", "Please wait...");

    navigator.getBattery().then(function(battery){

        const level = Math.round(battery.level * 100);
        const charging = battery.charging ? "Charging ⚡" : "Not Charging";

        openPopup(
            "🔋 Battery Status",
            `Level: ${level}%\nStatus: ${charging}`
        );

    });

};

window.startSpeech = function(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    // Check support
    if(!SpeechRecognition){
        openPopup(
            "Speech To Text",
            "Speech recognition not supported ❌"
        );
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    openPopup(
        "🎤 Listening...",
        "Speak something now."
    );

    // When speech is detected
    recognition.onresult = function(event){

        const text =
            event.results[0][0].transcript;

        openPopup(
            "🎤 Speech Result",
            text
        );
    };

    // Error handling
    recognition.onerror = function(){
        openPopup(
            "Error",
            "Could not recognize speech ❌"
        );
    };

};

// =========================
// CLOSE POPUP
// =========================
if(closeBtn){

    closeBtn.onclick = () => {

        popup.style.display = "none";

        // Stop camera when popup closes
        const video =
            document.getElementById("cameraVideo");

        if(video && video.srcObject){

            const tracks =
                video.srcObject.getTracks();

            tracks.forEach(track => track.stop());
        }
    };
}

// =========================
// CAMERA FUNCTION
// =========================
window.openCamera = async function(){

    // Check support
    if(
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ){

        openPopup(
            "Camera",
            "Camera not supported ❌"
        );

        return;
    }

    // Open popup
    popup.style.display = "flex";

    title.innerText =
        "📷 Camera Access";

    // Add video inside popup
    content.innerHTML = `
        <video
            id="cameraVideo"
            autoplay
            playsinline
            style="
                width:100%;
                border-radius:15px;
                margin-top:10px;
            ">
        </video>
    `;

    try{

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video:true
            });

        const video =
            document.getElementById("cameraVideo");

        video.srcObject = stream;

    }

    catch(error){

        openPopup(
            "Camera Error",
            "Unable to access camera ❌"
        );
    }

};

window.openMedia = function(){

    // Open popup
    popup.style.display = "flex";

    title.innerText = "📁 Media Access";

    // Popup content
    content.innerHTML = `
        <input 
            type="file"
            id="mediaInput"
            style="
                margin-top:15px;
                color:white;
            "
        >

        <p id="fileName"
        style="
            margin-top:15px;
            font-size:14px;
        ">
        No file selected
        </p>
    `;

    // Get input
    const mediaInput =
        document.getElementById("mediaInput");

    const fileName =
        document.getElementById("fileName");

    // When user selects file
    mediaInput.onchange = function(){

        if(mediaInput.files.length > 0){

            const file =
                mediaInput.files[0];

            fileName.innerText =
                "Selected File: " + file.name;
        }
    };

};

});

