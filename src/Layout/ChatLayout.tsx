import { Theme } from "@/components/Theme";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Trash2 } from "lucide-react";
import { IoCreateOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  createNewChat,
  setActiveChat,
  deleteChat
} from "@/redux/slice/chatSlice";
import { useMemo, useState } from "react";
import { ChatInterface } from "@/aiInterface/ChatInterface";

export const ChatLayout = () => {
  const dispatch = useAppDispatch();
  const { chats, activeChatId } = useAppSelector((state) => state.chat);
  const [open, setOpen] = useState<boolean>(true);
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const lastMessageA =
        a.messages.length > 0
          ? new Date(a.messages[a.messages.length - 1].timestamp).getTime()
          : 0;
      const lastMessageB =
        b.messages.length > 0
          ? new Date(b.messages[b.messages.length - 1].timestamp).getTime()
          : 0;
      return lastMessageB - lastMessageA;
    });
  }, [chats]);
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="offcanvas" className="max-w-md">
        <SidebarHeader className="bg-card border-b dark:border-slate-800  md:hidden">
          <h2 className="text-lg font-semibold text-center">Chat Menu</h2>
        </SidebarHeader>
        <SidebarHeader
          onClick={() => dispatch(createNewChat())}
          className="bg-card border-b dark:border-slate-800"
        >
          <div className="flex justify-end">
            <IoCreateOutline size={30} />
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-background text-primary">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {sortedChats.slice().map((chat) => (
                  <SidebarMenuItem
                    key={chat.id}
                    className="flex items-center justify-between"
                  >
                    <SidebarMenuButton
                      onClick={() => dispatch(setActiveChat(chat.id))}
                      className={`flex-grow flex items-center gap-2 p-2 rounded transition-color ${
                        activeChatId === chat.id
                          ? "bg-button hover:bg-button-hover"
                          : ""
                      }`}
                    >
                      <span>Chat - {chat.messages[0]?.text || "New Chat"}</span>
                    </SidebarMenuButton>

                    <button
                      onClick={() => dispatch(deleteChat(chat.id))}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="w-full text-primary bg-card border-t dark:border-slate-800 text-sm">
          <div className="flex justify-between items-center">
            <p>© {new Date().getFullYear()} Emmanuel Chat App</p>

            <Theme />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger className="text-primary fixed max-sm:top-4 top-3 left-2 z-10 mr-5 hover:bg-card" />
      <main className="w-full relative h-screen overflow-hidden bg-background p-4   max-sm:px-0">
        <div className="bg-background overflow-hidden">
          {activeChatId ? (
            <ChatInterface isSidebarOpen={open} />
          ) : (
            <p className="text-center text-primary mt-10">
              Select a chat to start messaging
            </p>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
};
