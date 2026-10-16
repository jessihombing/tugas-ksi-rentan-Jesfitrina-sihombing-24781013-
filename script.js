// 1. ATURAN API KEY: Simpan di sessionStorage, bukan di kode!
const apiKeyInput = document.getElementById('apiKeyInput');
apiKeyInput.addEventListener('input', (e) => {
    sessionStorage.setItem('user_api_key', e.target.value);
});

// 2. FUNGSI MENGAMBIL API KEY (dengan try/catch)
function getApiKey() {
    try {
        const key = sessionStorage.getItem('user_api_key');
        if (!key) throw new Error("API Key kosong");
        return key;
    } catch (error) {
        console.error("Gagal mengambil API Key:", error);
        return null; // Memicu mode cadangan
    }
}

// 3. FUNGSI MOCK (Mode Cadangan jika tidak ada API Key)
function getMockResponse(prompt) {
    return `[MODE TIRUAN (CADANGAN)] Anda bertanya: "${prompt}". Ini adalah jawaban simulasi karena API Key tidak ditemukan.`;
}

// 4. FUNGSI UTAMA MENGIRIM PROMPT
document.getElementById('submitBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('promptInput').value;
    const outputArea = document.getElementById('outputArea');
    const apiKey = getApiKey();

    // Jika tidak ada API Key, gunakan mode tiruan
    if (!apiKey) {
        outputArea.innerHTML = getMockResponse(prompt);
        return;
    }

    outputArea.innerHTML = "Sedang memproses...";

    try {
        // Panggil API Gemini (Contoh endpoint)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        // CELAH KEAMANAN 1: Menggunakan innerHTML (Rentan XSS)
        // CELAH KEAMANAN 2: Tidak ada filter pada prompt (Rentan Prompt Injection)
        outputArea.innerHTML = aiText; 

    } catch (error) {
        outputArea.innerHTML = "Error: " + error.message;
    }
});