
import { SocketProvider } from "@/context/socketProvider";
export default function ChatLayout({
  children,
}: {
  children: any;
}) {
  return (
    // <SocketProvider >
    //   {children}
    // </SocketProvider>
    <div>
      {children}
    </div>
  );
}
