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

        {/* Right Panel — Evidence + Live Claim Intelligence */}
        <div
          className={cn(
            "hidden lg:flex flex-col border-l border-border bg-white transition-all overflow-hidden",
            evidencePanelOpen ? "w-[35%]" : "w-0"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text">Claim Intelligence</h3>
            <button
              onClick={() => setEvidencePanelOpen(false)}
              className="p-1 hover:bg-surface rounded transition-colors"
              aria-label="Close panel"
            >
              <PanelRightClose className="h-4 w-4 text-text-light" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Live Claim Strength */}
            <div className="bg-surface rounded-xl p-4 border border-border">
              <h4 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3">Claim Strength</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke={messages.length > 3 ? "#10B981" : messages.length > 1 ? "#F59E0B" : "#E2E8F0"} strokeWidth="3" strokeLinecap="round" strokeDasharray="100.5" strokeDashoffset={100.5 * (1 - Math.min(messages.length * 12, 82) / 100)} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text">
                    {Math.min(messages.length * 12, 82)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">
                    {messages.length <= 1 ? "Listening..." : messages.length <= 3 ? "Building..." : "Strong"}
                  </p>
                  <p className="text-xs text-text-light">
                    {messages.length <= 1 ? "Tell us what happened" : messages.length <= 3 ? "Keep going — more detail helps" : "Good foundation established"}
                  </p>
                </div>
              </div>
              {messages.length > 1 && (
                <div className="space-y-1.5">
                  {[
                    { label: "Facts", score: Math.min(messages.length * 15, 88) },
                    { label: "Evidence", score: Math.min(evidence.length * 25, 79) },
                    { label: "Legal Basis", score: Math.min(messages.length * 10, 85) },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-text-light">{item.label}</span>
                        <span className="font-medium text-text">{item.score}</span>
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.score >= 60 ? '#10B981' : item.score >= 30 ? '#F59E0B' : '#E2E8F0'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI-Detected Area of Law */}
            {messages.length > 1 && (
              <div className="bg-surface rounded-xl p-4 border border-border">
                <h4 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">AI Classification</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text">Area of Law</span>
                    <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                      {messages.length > 3 ? "Employment" : "Detecting..."}
                    </span>
                  </div>
                  {messages.length > 2 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text">Primary Claim</span>
                      <span className="text-xs font-semibold text-accent px-2 py-0.5 bg-accent/10 rounded-full">
                        {messages.length > 3 ? "Breach of Contract" : "Analyzing..."}
                      </span>
                    </div>
                  )}
                  {messages.length > 4 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text">Limitation</span>
                      <span className="text-xs font-semibold text-success px-2 py-0.5 bg-success/10 rounded-full">
                        Within time
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Evidence Upload */}
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
