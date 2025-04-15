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
import { TbMessageCirclePlus } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  createNewChat,
  setActiveChat,
  deleteChat
} from "@/redux/slice/chatSlice";
import { useMemo, useState } from "react";
import { ChatInterface } from "@/aiInterface/ChatInterface";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

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
            <TbMessageCirclePlus size={30} strokeWidth={1} />
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

      <main className="w-full relative h-screen overflow-hidden bg-background p-4   max-sm:px-0">
        <div className="bg-background h-full overflow-hidden">
          <div className="flex items-center justify-between w-full md:hidden">
            <Navbar isSidebarOpen={open} sidebarTrigger={<SidebarTrigger />} />
          </div>
          {open ? (
            <div className="hidden md:block">
              <SidebarTrigger className="fixed left-2 z-10 top-4" />
              <Navbar
                isSidebarOpen={open}
                sidebarTrigger={<SidebarTrigger />}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <SidebarTrigger className="fixed left-2 z-10 top-4" />
              <Navbar isSidebarOpen={open} />
            </div>
          )}
          {activeChatId ? (
            <ChatInterface isSidebarOpen={open} />
          ) : (
            <motion.div
              className="mt-2 flex flex-col justify-center h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="text-center text-3xl md:text-4xl text-slate-600 dark:text-slate-300  mt-10">
                What can I help you with?
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 px-8 mt-3 text-center">
                Summarization is available only for texts with a minimum of 150
                words
              </p>

              <div className=" justify-center  mt-4 flex flex-wrap  gap-2">
                <div
                  onClick={() => dispatch(createNewChat())}
                  className="cursor-pointer"
                >
                  <Button className="rounded-2xl cursor-pointer border bg-button hover:bg-button-hover transition-colors duration-100 text-slate-600 dark:text-slate-300">
                    Create New Chat
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
};
