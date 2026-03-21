"use client";

import { useState } from "react";
import {
  PanelRightClose,
  PanelRightOpen,
  BarChart3,
  FileText,
  MessageSquare,
  FileStack,
  Zap,
} from "lucide-react";
import { ChatContainer } from "@/components/chat/chat-container";
import { EvidenceList } from "@/components/evidence/evidence-list";
import { UploadZone } from "@/components/evidence/upload-zone";
import { cn } from "@/lib/utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface EvidenceItem {
  id: string;
  filename: string;
  type: string;
  size: number;
  status: "uploading" | "parsing" | "parsed" | "analyzed";
  tags: string[];
  forensicIssues?: boolean;
}

// Placeholder data
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Welcome to your claim workspace. I'm here to help you build a strong legal claim. Let's start by understanding your situation.\n\nCan you tell me, in your own words, what happened? Please include:\n- **When** did the issue occur?\n- **Who** is involved?\n- **What** happened?\n\nTake your time — the more detail you provide, the stronger we can make your claim.",
    timestamp: new Date("2025-03-21T12:00:00"),
  },
];

const sampleEvidence: EvidenceItem[] = [
  {
    id: "ev-1",
    filename: "employment-contract.pdf",
    type: "application/pdf",
    size: 245000,
    status: "analyzed",
    tags: ["contract", "employment terms", "notice period"],
  },
  {
    id: "ev-2",
    filename: "termination-email.eml",
    type: "message/rfc822",
    size: 18000,
    status: "parsed",
    tags: ["communication", "termination"],
  },
];

export default function ClaimWorkspacePage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(sampleEvidence);
  const [isResponding, setIsResponding] = useState(false);
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(true);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsResponding(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "Thank you for sharing that. I can see the key elements forming here. Let me ask some follow-up questions to strengthen your claim:\n\n1. Do you have any **written communication** where the other party acknowledged their obligations?\n2. Were there any **witnesses** to the events you described?\n3. What **financial losses** or damages have you experienced as a result?\n\nAlso, please upload any relevant documents using the evidence panel on the right.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsResponding(false);
    }, 2000);
  };

  const handleFilesUploaded = (files: File[]) => {
    const newEvidence: EvidenceItem[] = files.map((file) => ({
      id: `ev-${Date.now()}-${file.name}`,
      filename: file.name,
      type: file.type,
      size: file.size,
      status: "uploading" as const,
      tags: [],
    }));
    setEvidence((prev) => [...prev, ...newEvidence]);

    // Simulate processing
    setTimeout(() => {
      setEvidence((prev) =>
        prev.map((item) =>
          newEvidence.find((n) => n.id === item.id)
            ? { ...item, status: "parsing" as const }
            : item
        )
      );
    }, 1500);

    setTimeout(() => {
      setEvidence((prev) =>
        prev.map((item) =>
          newEvidence.find((n) => n.id === item.id)
            ? { ...item, status: "parsed" as const, tags: ["uploaded"] }
            : item
        )
      );
    }, 3000);
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div
          className={cn(
            "flex flex-col transition-all",
            evidencePanelOpen ? "w-full lg:w-[65%]" : "w-full"
          )}
        >
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isResponding={isResponding}
          />
        </div>

        {/* Evidence Panel */}
        <div
          className={cn(
            "hidden lg:flex flex-col border-l border-border bg-white transition-all overflow-hidden",
            evidencePanelOpen ? "w-[35%]" : "w-0"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text">Evidence</h3>
            <button
              onClick={() => setEvidencePanelOpen(false)}
              className="p-1 hover:bg-surface rounded transition-colors"
              aria-label="Close evidence panel"
            >
              <PanelRightClose className="h-4 w-4 text-text-light" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <UploadZone onFilesUploaded={handleFilesUploaded} />
            <EvidenceList
              evidence={evidence}
              onDelete={handleDeleteEvidence}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-border">
        <div className="flex items-center gap-4 text-xs text-text-light">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            AI Ready
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {messages.length} messages
          </span>
          <span className="flex items-center gap-1">
            <FileStack className="h-3.5 w-3.5" />
            {evidence.length} evidence items
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!evidencePanelOpen && (
            <button
              onClick={() => setEvidencePanelOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-light hover:text-text border border-border rounded-md hover:bg-surface transition-colors"
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
              Evidence
            </button>
          )}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent border border-accent/20 rounded-md hover:bg-accent/5 transition-colors">
            <Zap className="h-3.5 w-3.5" />
            Analyze Claim
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-colors">
            <FileText className="h-3.5 w-3.5" />
            Generate LBA
          </button>
        </div>
      </div>
    </div>
  );
}
