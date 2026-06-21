import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/clinic";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hello, I would like to book a dental appointment.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}