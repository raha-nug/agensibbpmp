document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageInput = document.getElementById('chat-message');
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
        addChatBubble(messageText, 'sent');
        messageInput.value = '';
        // Simulate a response after a short delay
        setTimeout(() => addChatBubble('Ini adalah balasan otomatis.', 'received'), 1000);
    }
}

function addChatBubble(message, type) {
    const chatBody = document.getElementById('chat-body');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = message;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
}

document.getElementById('close-btn').addEventListener('click', function() {
    // Close button functionality (add your own logic if needed)
});
