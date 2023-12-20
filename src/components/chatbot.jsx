import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Santa from '../assets/pngwing.com (9).png';
const API_KEY = "";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      img: Santa,
      message: "Hello, I'm Santa! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    try {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "ChatGPT") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: messageObject.message }
      });

      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          { "role": "system" },
          ...apiMessages
        ]
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Check the structure and content of the API response

        const chatGPTResponse = data.choices?.[0]?.message?.content;
        if (chatGPTResponse) {
          setMessages([...chatMessages, { message: chatGPTResponse, sender: "ChatGPT" }]);
        }
        setIsTyping(false);
      } else if (response.status === 429) {
        const errorData = await response.json();
        console.error("API Quota Exceeded Error:", errorData);
        // Handle the quota exceeded scenario (notify the user, prevent further requests, etc.)
        setIsTyping(false); // Stop typing indicator
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        // Handle other API errors
        setIsTyping(false); // Stop typing indicator
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setIsTyping(false); // Stop typing indicator
    }
  }

  return (
    <section className="flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <header className="bg-cyan-700 rounded-t-lg p-6">
          <h1 className="text-slate-100 text-center">Santa Talks!</h1>
        </header>
        <div className="h-80">
          <MainContainer>
            <ChatContainer>
              <MessageList scrollBehavior="smooth" typingIndicator={isTyping ? <TypingIndicator content="Santa is typing" /> : null}>
              {messages.map((message, index) => (
               <div key={index} className='flex'>
                 <img src={message.img} />
                <Message key={index} model={message} />
                </div>
                ))}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </section>
  );
}

export default ChatBot;
