"use client";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return <div>MessageBubble</div>;
}
