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
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";

export const ChatLayout = () => {
  const dispatch = useAppDispatch();
  const { chats, activeChatId } = useAppSelector((state) => state.chat);
  const [open, setOpen] = useState<boolean>(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="offcanvas" className="max-w-md">
        <SidebarHeader className="bg-card border-b dark:border-slate-800duration-75 transition md:hidden">
          <h2 className="text-lg font-semibold text-center">Chat Menu</h2>
        </SidebarHeader>
        <SidebarHeader
          onClick={() => dispatch(createNewChat())}
          className="bg-card border-b dark:border-slate-800 duration-75 transition "
        >
          <div className="flex justify-end">
            <IoCreateOutline size={25} />
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-background duration-75 transition text-primary">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {chats.slice().map((chat) => (
                  <SidebarMenuItem
                    key={chat.id}
                    className="flex items-center justify-between"
                  >
                    <SidebarMenuButton
                      onClick={() => dispatch(setActiveChat(chat.id))}
                      className={`flex-grow flex items-center gap-2 p-2 rounded transition ${
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
      <SidebarTrigger className="text-primary fixed top-3 left-0 z-10 mr-5 hover:bg-card" />
      <main className="w-full relative h-screen overflow-hidden bg-background p-4  max-sm:px-0">
        <div className="bg-red-200 overflow-hidden">
          {activeChatId ? (
            <ChatInterface />
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
