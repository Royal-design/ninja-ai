import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: number;
  text: string;
  lang: string;
  type: "user" | "translation" | "summary";
  timestamp: string;
  isTranslating?: boolean;
  isSummarizing?: boolean;
}

interface Chat {
  id: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  detectedLang: string;
  selectedLang: string;
  error: string | null;
}

const loadChatsFromStorage = (): ChatState => {
  const storedChats = localStorage.getItem("chats");
  const storedActiveChat = localStorage.getItem("activeChatId");
  const chats = storedChats ? JSON.parse(storedChats) : [];
  const activeChatId = storedActiveChat
    ? JSON.parse(storedActiveChat)
    : chats.length > 0
    ? chats[0].id
    : null;

  return {
    chats,
    activeChatId,
    detectedLang: "en",
    selectedLang: "",
    error: null
  };
};

const saveChatsToStorage = (chats: Chat[], activeChatId: string | null) => {
  const sanitizedChats = chats.map((chat) => ({
    ...chat,
    messages: chat.messages.map(
      ({ isTranslating, isSummarizing, ...msg }) => msg
    )
  }));

  localStorage.setItem("chats", JSON.stringify(sanitizedChats));
  localStorage.setItem("activeChatId", JSON.stringify(activeChatId));
};

const generateChatId = () => `chat-${Date.now()}`;

const initialState: ChatState = loadChatsFromStorage();

if (initialState.chats.length === 0) {
  const newChat: Chat = { id: generateChatId(), messages: [] };
  initialState.chats.push(newChat);
  initialState.activeChatId = newChat.id;
  saveChatsToStorage(initialState.chats, initialState.activeChatId);
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createNewChat: (state) => {
      const newChat: Chat = { id: generateChatId(), messages: [] };
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
      saveChatsToStorage(state.chats, state.activeChatId);
    },

    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
      saveChatsToStorage(state.chats, state.activeChatId);
    },

    addMessage: (
      state,
      action: PayloadAction<{ text: string; lang: string }>
    ) => {
      if (!state.activeChatId) {
        const newChat: Chat = { id: generateChatId(), messages: [] };
        state.chats.unshift(newChat);
        state.activeChatId = newChat.id;
      }

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      chat.messages.push({
        id: chat.messages.length + 1,
        text: action.payload.text,
        lang: action.payload.lang,
        type: "user",
        timestamp: new Date().toISOString()
      });

      state.detectedLang = action.payload.lang;
      saveChatsToStorage(state.chats, state.activeChatId);
    },

    setTranslatedText: (
      state,
      action: PayloadAction<{ id: number; text: string }>
    ) => {
      if (!state.activeChatId) return;

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      chat.messages.push({
        id: chat.messages.length + 1,
        text: action.payload.text,
        lang: state.selectedLang,
        type: "translation",
        timestamp: new Date().toISOString()
      });

      saveChatsToStorage(state.chats, state.activeChatId);
    },

    setSummary: (
      state,
      action: PayloadAction<{ id: number; text: string }>
    ) => {
      if (!state.activeChatId) return;

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      chat.messages.push({
        id: chat.messages.length + 1,
        text: action.payload.text,
        lang: "en",
        type: "summary",
        timestamp: new Date().toISOString()
      });

      saveChatsToStorage(state.chats, state.activeChatId);
    },

    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);

      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chats.length > 0 ? state.chats[0].id : null;
      }

      saveChatsToStorage(state.chats, state.activeChatId);
    },

    setDetectedLang: (state, action: PayloadAction<string>) => {
      state.detectedLang = action.payload;
    },

    setSelectedLang: (state, action: PayloadAction<string>) => {
      state.selectedLang = action.payload;
    },

    setTranslateLoading: (
      state,
      action: PayloadAction<{ id: number; loading: boolean }>
    ) => {
      if (!state.activeChatId) return;

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      const message = chat.messages.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.isTranslating = action.payload.loading;
      }
    },

    setSummarizeLoading: (
      state,
      action: PayloadAction<{ id: number; loading: boolean }>
    ) => {
      if (!state.activeChatId) return;

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      const message = chat.messages.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.isSummarizing = action.payload.loading;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  createNewChat,
  setActiveChat,
  addMessage,
  setTranslatedText,
  setSummary,
  deleteChat,
  setDetectedLang,
  setSelectedLang,
  setError,
  setSummarizeLoading,
  setTranslateLoading
} = chatSlice.actions;
