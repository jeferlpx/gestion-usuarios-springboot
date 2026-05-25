import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import EmojiPicker from 'emoji-picker-react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [typing, setTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const stompClient = useRef(null);
    const userEmail = localStorage.getItem('userEmail');
    const typingTimeoutRef = useRef(null);

    // Scroll automático a mensajes nuevos
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        connect();
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, []);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws-chat');
        stompClient.current = Stomp.over(socket);
        
        stompClient.current.connect({}, () => {
            setConnected(true);
            
            // Suscribirse a mensajes públicos
            stompClient.current.subscribe('/topic/public', (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages(prev => [...prev, newMessage]);
            });
            
            // Suscribirse a indicadores de escritura
            stompClient.current.subscribe('/topic/typing', (message) => {
                const data = JSON.parse(message.body);
                if (data.sender !== userEmail) {
                    setTypingUser(data.sender);
                    setTimeout(() => setTypingUser(null), 1500);
                }
            });
            
            // Anunciar que el usuario se unió
            stompClient.current.send('/app/chat.addUser', {}, JSON.stringify({
                sender: userEmail,
                content: `${userEmail} se unió al chat`,
                type: 'JOIN'
            }));
        });
    };

    const sendMessage = () => {
        if (inputMessage.trim() && stompClient.current) {
            const chatMessage = {
                sender: userEmail,
                content: inputMessage,
                type: 'CHAT',
                timestamp: new Date().toISOString()
            };
            stompClient.current.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            setInputMessage('');
            setTyping(false);
            
            // Notificar que dejó de escribir
            stompClient.current.send('/app/chat.typing', {}, JSON.stringify({
                sender: userEmail,
                typing: false
            }));
        }
    };

    const handleTyping = (e) => {
        setInputMessage(e.target.value);
        
        if (!typing && e.target.value.length > 0) {
            setTyping(true);
            stompClient.current?.send('/app/chat.typing', {}, JSON.stringify({
                sender: userEmail,
                typing: true
            }));
        }
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (typing) {
                setTyping(false);
                stompClient.current?.send('/app/chat.typing', {}, JSON.stringify({
                    sender: userEmail,
                    typing: false
                }));
            }
        }, 1000);
    };

    const onEmojiClick = (emojiObject) => {
        setInputMessage(prev => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getAvatarColor = (email) => {
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#27ae60'];
        return colors[Math.abs(hash) % colors.length];
    };

    const getInitials = (email) => {
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <div className="card mt-4 shadow-lg" style={{ height: 'calc(100vh - 120px)', border: 'none' }}>
            <div className="card-header bg-gradient-primary text-white py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="mb-0">💬 Chat en Vivo</h4>
                        {connected && <small className="text-white-50">● Conectado</small>}
                        {!connected && <small className="text-white-50">○ Reconectando...</small>}
                    </div>
                    <div className="text-end">
                        <small className="d-block">
                            👤 {userEmail}
                        </small>
                        <small className="text-white-50">
                            {messages.length} mensajes
                        </small>
                    </div>
                </div>
            </div>
            
            <div className="card-body p-0" style={{ height: 'calc(100% - 80px)', overflowY: 'auto', background: '#f8f9fa' }}>
                <div className="p-3">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-3 ${msg.sender === userEmail ? 'text-end' : 'text-start'}`}>
                            {msg.type === 'JOIN' ? (
                                <div className="text-center my-2">
                                    <small className="bg-light px-3 py-1 rounded-pill text-muted">
                                        <i className="fas fa-user-plus"></i> {msg.content}
                                    </small>
                                </div>
                            ) : msg.type === 'LEAVE' ? (
                                <div className="text-center my-2">
                                    <small className="bg-light px-3 py-1 rounded-pill text-muted">
                                        <i className="fas fa-user-minus"></i> {msg.content}
                                    </small>
                                </div>
                            ) : (
                                <div className={`d-flex ${msg.sender === userEmail ? 'flex-row-reverse' : 'flex-row'} align-items-start`}>
                                    {msg.sender !== userEmail && (
                                        <div className="flex-shrink-0 me-2">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                                                 style={{ width: '40px', height: '40px', backgroundColor: getAvatarColor(msg.sender) }}>
                                                {getInitials(msg.sender)}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`d-inline-block p-3 rounded-3 shadow-sm ${msg.sender === userEmail ? 'bg-primary text-white' : 'bg-white'}`}
                                         style={{ maxWidth: '70%' }}>
                                        {msg.sender !== userEmail && (
                                            <small className="d-block fw-bold mb-1" style={{ color: getAvatarColor(msg.sender) }}>
                                                {msg.sender}
                                            </small>
                                        )}
                                        <div className="mb-1">{msg.content}</div>
                                        <small className={msg.sender === userEmail ? 'text-white-50' : 'text-muted'} style={{ fontSize: '0.7rem' }}>
                                            {formatTime(msg.timestamp)}
                                        </small>
                                    </div>
                                    {msg.sender === userEmail && (
                                        <div className="flex-shrink-0 ms-2">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                                                 style={{ width: '40px', height: '40px', backgroundColor: '#667eea' }}>
                                                {getInitials(userEmail)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {typingUser && (
                        <div className="text-start mb-2">
                            <div className="d-inline-block bg-white p-2 rounded-3 shadow-sm">
                                <small className="text-muted">
                                    <span className="fw-bold">{typingUser}</span> está escribiendo
                                    <span className="ms-1">
                                        <span className="animate-pulse">.</span>
                                        <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                                        <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                                    </span>
                                </small>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            <div className="card-footer bg-white border-0 py-3">
                <div className="input-group">
                    <button 
                        className="btn btn-outline-secondary rounded-circle me-2" 
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        style={{ width: '45px', height: '45px' }}
                    >
                        😊
                    </button>
                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Escribe un mensaje..."
                        value={inputMessage}
                        onChange={handleTyping}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={!connected}
                        style={{ borderRadius: '25px' }}
                    />
                    <button 
                        className="btn btn-primary rounded-circle ms-2" 
                        onClick={sendMessage} 
                        disabled={!connected || !inputMessage.trim()}
                        style={{ width: '45px', height: '45px' }}
                    >
                        📤
                    </button>
                </div>
                {showEmojiPicker && (
                    <div className="position-absolute bottom-0 mb-5" style={{ zIndex: 1000 }}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;