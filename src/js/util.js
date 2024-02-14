function copyResult() {
    const resultText = document.getElementById('result');
    copyToClipboard(resultText.innerText);
}

function copySeedResult() {
    const seedResultText = document.getElementById('seedResult');
    copyToClipboard(seedResultText.innerText);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function toggleCopyButton(resultId, buttonId) {
    const resultText = document.getElementById(resultId);
    const copyButton = document.getElementById(buttonId);
    copyButton.classList.toggle('show', resultText.innerText.trim() !== '');
}