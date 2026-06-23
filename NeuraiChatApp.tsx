// NeuraiChatApp.tsx
import "./menu.css";
import React, { useState } from "react";

type Chat = {
  id: string;
  title: string;
};

const initialChats: Chat[] = [
  { id: "1", title: "Első beszélgetés" },
  { id: "2", title: "Prompt ötletek" },
  { id: "3", title: "Neurai fejlesztési jegyzetek" },
];

export function NeuraiChatApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>("1");

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const createNewChat = () => {
    const id = String(Date.now());
    const newChat: Chat = {
      id,
      title: `Új chat #${chats.length + 1}`,
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(id);
  };

  const selectChat = (id: string) => {
    setActiveChatId(id);
    setIsMenuOpen(false); // mobilon jó érzés, ha bezár
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="app-root">
      {/* Felső sáv */}
      <header className="topbar">
        <button className="menu-button" onClick={toggleMenu}>
          {/* egyszerű hamburger ikon */}
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
        <div className="topbar-title">Neurai</div>
      </header>

      {/* Oldalsó menü + overlay */}
      <div className={`sidebar-overlay ${isMenuOpen ? "open" : ""}`}>
        <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <span className="sidebar-title">Beszélgetések</span>
            <button className="new-chat-button" onClick={createNewChat}>
              + Új chat
            </button>
          </div>

          <div className="chat-list">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={
                  "chat-list-item" +
                  (chat.id === activeChatId ? " active" : "")
                }
                onClick={() => selectChat(chat.id)}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </aside>

        {/* háttér overlay – kattintásra bezár */}
        <div
          className="overlay-click-area"
          onClick={() => setIsMenuOpen(false)}
        />
      </div>

      {/* Fő chat terület */}
      <main className="chat-main">
        <div className="chat-header">
          <h2>{activeChat?.title ?? "Nincs kiválasztott chat"}</h2>
        </div>
        <div className="chat-body">
          <p>
            Itt jelenik meg a Neurai válasza az aktív beszélgetésben. Ide
            kötöd majd a valódi chat UI‑t.
          </p>
        </div>
      </main>
    </div>
  );
}
