import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/aiInterface/ChatInterface";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  createNewChat,
  setActiveChat,
  deleteChat
} from "@/redux/slice/chatSlice";
import { cn } from "@/lib/utils";
import logo from "../assets/image/ninjalogo.png";

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
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="flex h-16 shrink-0 flex-row items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="size-8 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight">
              Ninja.AI
            </span>
          </div>
        </SidebarHeader>

        <div className="px-3 pt-3">
          <Button
            onClick={() => dispatch(createNewChat())}
            className="w-full rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New chat
          </Button>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Recent chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {sortedChats.map((chat) => {
                  const isActive = activeChatId === chat.id;
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => dispatch(setActiveChat(chat.id))}
                        className="gap-2.5"
                      >
                        <MessageCircle
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-brand" : "text-muted-foreground"
                          )}
                        />
                        <span className="truncate">
                          {chat.messages[0]?.text || "New chat"}
                        </span>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        showOnHover
                        aria-label="Delete chat"
                        onClick={() => dispatch(deleteChat(chat.id))}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Ninja.AI · Language toolkit
          </p>
        </SidebarFooter>
      </Sidebar>

      <main
        className={cn(
          "relative flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-background"
        )}
      >
        <Navbar
          isSidebarOpen={open}
          sidebarTrigger={<SidebarTrigger className="ml-1" />}
        />

        {activeChatId ? (
          <ChatInterface />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center"
          >
            <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              What can I help you with?
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Start a new conversation to translate, detect, or summarize text.
            </p>
            <Button
              onClick={() => dispatch(createNewChat())}
              className="mt-2 rounded-xl"
            >
              <Plus className="size-4" />
              New chat
            </Button>
          </motion.div>
        )}
      </main>
    </SidebarProvider>
  );
};
