
import ChatInterface from '@/components/chat/chat-interface';
import type { Locale } from '@/i18n-config';

export default function ChatPage({ params: { lang } }: { params: { lang: Locale } }) {
  return <ChatInterface lang={lang} />;
}
