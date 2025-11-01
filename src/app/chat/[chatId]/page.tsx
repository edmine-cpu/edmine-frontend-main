"use client";

import MessageTranslationStatus from "@/components/chat/MessageTranslationStatus";
import TranslationToggle from "@/components/chat/TranslationToggle";
import { Header } from "@/components/Header/Header";
import { API_ENDPOINTS } from "@/config/api";
import { useTranslation } from "@/hooks/useTranslation";
import { checkAuth } from "@/utils/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Lang = "uk" | "en" | "pl" | "fr" | "de";

const texts = {
  uk: {
    partner: "Партнер",
    chat: "Чат",
    back: "Назад",
    online: "Онлайн",
    loading: "Завантаження...",
    file: "Файл",
    attachFile: "Прикріпити файл",
    messagePlaceholder:
      "Введіть повідомлення... (Shift+Enter для нового рядка)",
    send: "Відправити (Enter)",
    fileTooLarge: "Файл занадто великий. Максимальний розмір: 30 МБ",
    bytes: "Bytes",
    kb: "KB",
    mb: "MB",
    gb: "GB",
  },
  en: {
    partner: "Partner",
    chat: "Chat",
    back: "Back",
    online: "Online",
    loading: "Loading...",
    file: "File",
    attachFile: "Attach file",
    messagePlaceholder: "Enter message... (Shift+Enter for new line)",
    send: "Send (Enter)",
    fileTooLarge: "File is too large. Maximum size: 30 MB",
    bytes: "Bytes",
    kb: "KB",
    mb: "MB",
    gb: "GB",
  },
  pl: {
    partner: "Partner",
    chat: "Czat",
    back: "Wstecz",
    online: "Online",
    loading: "Ładowanie...",
    file: "Plik",
    attachFile: "Załącz plik",
    messagePlaceholder: "Wprowadź wiadomość... (Shift+Enter dla nowej linii)",
    send: "Wyślij (Enter)",
    fileTooLarge: "Plik jest za duży. Maksymalny rozmiar: 30 MB",
    bytes: "Bytes",
    kb: "KB",
    mb: "MB",
    gb: "GB",
  },
  fr: {
    partner: "Partenaire",
    chat: "Chat",
    back: "Retour",
    online: "En ligne",
    loading: "Chargement...",
    file: "Fichier",
    attachFile: "Joindre un fichier",
    messagePlaceholder:
      "Entrez un message... (Shift+Enter pour une nouvelle ligne)",
    send: "Envoyer (Enter)",
    fileTooLarge: "Le fichier est trop volumineux. Taille maximale: 30 MB",
    bytes: "Bytes",
    kb: "KB",
    mb: "MB",
    gb: "GB",
  },
  de: {
    partner: "Partner",
    chat: "Chat",
    back: "Zurück",
    online: "Online",
    loading: "Laden...",
    file: "Datei",
    attachFile: "Datei anhängen",
    messagePlaceholder: "Nachricht eingeben... (Shift+Enter für neue Zeile)",
    send: "Senden (Enter)",
    fileTooLarge: "Datei ist zu groß. Maximale Größe: 30 MB",
    bytes: "Bytes",
    kb: "KB",
    mb: "MB",
    gb: "GB",
  },
} as const;

interface Message {
  id: number;
  content: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  sender_id: number;
  created_at: string;
  translatedContent?: string;
  isTranslated?: boolean;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const [partnerName, setPartnerName] = useState("Партнер");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatIdParam = params.chatId as string;
  const lang = "en" as Lang;
  const t = texts[lang];

  // Инициализируем хук перевода
  const translation = useTranslation(chatId || 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const response = await fetch(
        `${API_ENDPOINTS.chats}/${chatId}/messages`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const messages = data.messages || data;

        if (Array.isArray(messages)) {
          setMessages(messages.reverse()); // Reverse to show oldest first
        } else {
          console.error("Messages data is not an array:", data);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !chatId) return;

    const formData = new FormData();
    if (newMessage.trim()) {
      formData.append("content", newMessage);
    }
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.chats}/${chatId}/messages`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        setNewMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (chatIdParam) {
      setChatId(parseInt(chatIdParam));
      setLoading(false);
    }
  }, [chatIdParam]);

  useEffect(() => {
    const initChat = async () => {
      if (chatId) {
        const isAuth = await checkAuth();
        if (!isAuth) {
          router.push(`/login`);
          return;
        }

        // Получаем информацию о текущем пользователе
        try {
          const response = await fetch(API_ENDPOINTS.meApi, {
            credentials: "include",
          });
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Auto-refresh every 3 seconds
        return () => clearInterval(interval);
      }
    };
    initChat();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return `0 ${t.bytes}`;
    const k = 1024;
    const sizes = [t.bytes, t.kb, t.mb, t.gb];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Функция для обработки клика по файлу
  const handleFileClick = (filePath: string) => {
    window.open(`${API_ENDPOINTS.static}/${filePath}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header lang={lang as any} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">{t.loading}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang as any} />

      {/* Chat Container - Full height with proper centering */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Header */}
          <div className="bg-white rounded-t-xl shadow-sm border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  {t.back}
                </button>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {partnerName}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {t.chat} #{chatId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <TranslationToggle
                  isEnabled={translation.state.isEnabled}
                  isLoading={translation.state.isLoading}
                  onToggle={translation.toggleTranslation}
                  onLanguageChange={translation.setTargetLanguage}
                  error={translation.state.error}
                  lang="en"
                />
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-sm text-gray-600">{t.online}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-white overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message, index) => {
                const isOwn = message.sender_id === currentUserId;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showAvatar =
                  !prevMessage || prevMessage.sender_id !== message.sender_id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    } ${!showAvatar ? "mt-1" : "mt-4"}`}
                  >
                    {/* Avatar для чужих сообщений */}
                    {!isOwn && (
                      <div
                        className={`flex-shrink-0 w-8 h-8 mr-3 ${
                          showAvatar ? "" : "invisible"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-lg px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        isOwn
                          ? "bg-red-500 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      {message.content && (
                        <>
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {translation.getMessageContent(
                              message.id,
                              message.content
                            )}
                          </div>
                          <MessageTranslationStatus
                            isTranslated={translation.isMessageTranslated(
                              message.id
                            )}
                            detectedLanguage={
                              translation.translatedMessages.get(message.id)
                                ?.detectedLanguage
                            }
                            targetLanguage={translation.state.targetLanguage}
                            lang="en"
                          />
                        </>
                      )}

                      {message.file_path && (
                        <div className="mt-3">
                          <a
                            href={`${API_ENDPOINTS.static}/${message.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                              isOwn
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            {message.file_name || t.file}
                            {message.file_size && (
                              <span className="ml-2 text-xs opacity-75">
                                ({formatFileSize(message.file_size)})
                              </span>
                            )}
                          </a>
                        </div>
                      )}

                      <div
                        className={`text-xs mt-2 ${
                          isOwn ? "text-red-100" : "text-gray-400"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString(
                          "uk-UA",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                    </div>

                    {/* Avatar для своих сообщений */}
                    {isOwn && (
                      <div
                        className={`flex-shrink-0 w-8 h-8 ml-3 ${
                          showAvatar ? "" : "invisible"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-6 rounded-b-xl">
              {selectedFile && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex items-end space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      if (e.target.files[0].size > 30 * 1024 * 1024) {
                        alert(t.fileTooLarge);
                        return;
                      }
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.attachFile}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.messagePlaceholder}
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    rows={2}
                    style={{ minHeight: "60px", maxHeight: "120px" }}
                  />
                  {/* Character count */}
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {newMessage.length}/1000
                  </div>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !selectedFile}
                  className="flex-shrink-0 p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  title={t.send}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
