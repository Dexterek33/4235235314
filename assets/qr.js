var error = document.querySelector(".error");

document.querySelectorAll(".action").forEach((element, index) => {
    element.addEventListener('click', () => {
        if (index === 0) {
            startScanner();
        } else {
            showQRCode();
        }
    });
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains("close")) {
        document.querySelector(".error")?.classList.remove("error_open");
        document.querySelector(".scanner_view")?.remove();
        document.querySelector(".qr_view")?.remove();
    }
});

function showQRCode() {
    const container = document.createElement("div");
    container.className = "qr_view";
    container.innerHTML = `
        <p class="main_title">Pokaż kod QR</p>
        <p class="description">Pokaż ten kod osobie, która sprawdza dokument</p>
        <div id="qrcode" style="margin: 20px auto;"></div>
        <p class="code_text">Kod:</p>
        <p class="code_number" id="code-number"></p>

        <div class="timer_bar"><div id="time-bar"></div></div>
        <p class="expires_text" id="expires-text"></p>

        <div class="bottom-logos">
        <div class="left-section">
        <img src="https://i.imgur.com/1XtqkbK.gif" alt="Godło" class="left_logo">
        <p class="logos_text">Rzeczpospolita <br>Polska</p>
        </div>
        <img src="https://i.imgur.com/PF3ac4i.gif" alt="Godło animated" class="right_logo">
        </div>



        <p class="error_button close">Zamknij</p>
    `;
    document.body.appendChild(container);

    const code = Math.floor(100000 + Math.random() * 900000);
    document.getElementById("code-number").textContent = code;

    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: code.toString(),
        width: 200,
        height: 200
    });

    let timeLeft = 180;
    const bar = document.getElementById("time-bar");
    const expires = document.getElementById("expires-text");
    const timer = setInterval(() => {
        timeLeft--;
        bar.style.width = (timeLeft / 180 * 100) + "%";
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        expires.innerHTML = `Kod wygaśnie za: <strong>${min} min ${sec < 10 ? '0' + sec : sec} sek</strong>.`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            expires.innerHTML = "Kod wygasł.";
        }
    }, 1000);
}

function startScanner() {
    const container = document.createElement("div");
    container.className = "scanner_view";
    container.innerHTML = `
        <p class="main_title">Zeskanuj kod QR</p>
        <div id="reader" style="width: 300px; margin: 20px auto;"></div>
        <p class="error_button close">Zamknij</p>
    `;
    document.body.appendChild(container);

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText, decodedResult) => {
            alert("Zeskanowany kod: " + decodedText);
            html5QrCode.stop();
            document.querySelector(".scanner_view")?.remove();
        },
        (errorMessage) => { /* Obsługa błędów nie jest potrzebna */ }
    );
}
