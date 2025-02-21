// import { chatSchema } from "@/chatSchema";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "./ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useAppDispatch } from "@/redux/store";
// import { addMessage, setError } from "@/redux/slice/chatSlice";
// import { detectLanguage } from "@/ai/detectLanguage";
// import { Textarea } from "./ui/textarea";
// import { IoIosSend } from "react-icons/io";
// import { useState } from "react";
// import { Button } from "./ui/button";

// const inputSchema = chatSchema.pick({
//   text: true
// });
// type InputSchema = z.infer<typeof inputSchema>;

// type TextInputProps = {
//   scrollToBottom: () => void;
// };

// export const TextInput = ({ scrollToBottom }: TextInputProps) => {
//   const dispatch = useAppDispatch();
//   const [loading] = useState(false);

//   const form = useForm<InputSchema>({
//     resolver: zodResolver(inputSchema),
//     defaultValues: { text: "" }
//   });

//   const onSubmit = async (data: InputSchema) => {
//     try {
//       const { detectedLanguage } = await detectLanguage(data.text);

//       dispatch(
//         addMessage({
//           text: data.text,
//           lang: detectedLanguage || "unknown"
//         })
//       );
//       form.reset();
//       scrollToBottom();
//     } catch (err) {
//       console.error("Language Detection Failed:", err);
//       dispatch(setError("Failed to detect language."));
//     }
//   };

//   return (
//     <div className="">
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className=" items-center relative w-full  rounded"
//         >
//           <FormField
//             control={form.control}
//             name="text"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel />
//                 <FormControl>
//                   <div className="">
//                     <Textarea
//                       placeholder="Type your message..."
//                       {...field}
//                       className="w-full p-4 min-h-[5rem] max-h-[8rem] max-sm:max-h-[8rem]  rounded-4xl resize-none overflow-y-auto scrollbar-hidden"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             variant="ghost"
//             className="ml-2 hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-primary cursor-pointer"
//             type="submit"
//             disabled={loading || form.formState.isSubmitting}
//             aria-label="Send Message"
//           >
//             {loading ? (
//               <span className="w-5 h-5 border-2 border-primary  border-t-transparent rounded-full animate-spin"></span>
//             ) : (
//               <div className="bg-card hover:border-2 duration-100 dark:border-yellow-500 border rounded-full p-2">
//                 <IoIosSend className="size-6" />
//               </div>
//             )}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

import { chatSchema } from "@/chatSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/store";
import { addMessage, setError } from "@/redux/slice/chatSlice";
import { Textarea } from "./ui/textarea";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { Button } from "./ui/button";
import { googleLanguageDetector } from "@/googleApi/googleLanguageDetector";

const inputSchema = chatSchema.pick({
  text: true
});
type InputSchema = z.infer<typeof inputSchema>;

type TextInputProps = {
  scrollToBottom: () => void;
};

export const TextInput = ({ scrollToBottom }: TextInputProps) => {
  const dispatch = useAppDispatch();
  const [loading] = useState(false);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });

  const onSubmit = async (data: InputSchema) => {
    try {
      const detectedLanguage = await googleLanguageDetector(data.text);
      console.log(detectedLanguage);

      dispatch(
        addMessage({
          text: data.text,
          lang: detectedLanguage?.language,
          name: detectedLanguage?.country,
          code: detectedLanguage?.code
        })
      );
      form.reset();
      scrollToBottom();
    } catch (err) {
      console.error("Language Detection Failed:", err);
      dispatch(setError("Failed to detect language."));
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" items-center relative w-full  rounded"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <div className="">
                    <Textarea
                      placeholder="Type your message..."
                      {...field}
                      className="w-full p-4 min-h-[5rem] max-h-[8rem] max-sm:max-h-[8rem]  rounded-4xl resize-none overflow-y-auto scrollbar-hidden"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="ghost"
            className="ml-2 hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-primary cursor-pointer"
            type="submit"
            disabled={loading || form.formState.isSubmitting}
            aria-label="Send Message"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-primary  border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <div className="bg-card hover:border-2 duration-100 dark:border-yellow-500 border rounded-full p-2">
                <IoIosSend className="size-6" />
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
