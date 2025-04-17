"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyIcon, CheckIcon } from "lucide-react";

type CodeBlockProps = {
    language: string;
    filename?: string;
    highlightLines?: number[];
    showLineNumbers?: boolean;
} & (
        | {
            code: string;
            tabs?: never;
        }
        | {
            code?: never;
            tabs: Array<{
                name: string;
                code: string;
                language?: string;
                highlightLines?: number[];
            }>;
        }
    );

export const CodeBlock = ({
    language,
    filename,
    code,
    highlightLines = [],
    tabs = [],
    showLineNumbers = true,
}: CodeBlockProps) => {
    const [copied, setCopied] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(0);

    const tabsExist = tabs.length > 0;

    const copyToClipboard = async () => {
        const textToCopy = tabsExist ? tabs[activeTab].code : code;
        if (textToCopy) {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const activeCode = tabsExist ? tabs[activeTab].code : code;
    const activeLanguage = tabsExist
        ? tabs[activeTab].language || language
        : language;
    const activeHighlightLines = tabsExist
        ? tabs[activeTab].highlightLines || []
        : highlightLines;

    return (
        <div className="relative w-full rounded-lg bg-black dark:bg-[#161616] p-4 font-mono text-sm">
            <div className="flex flex-col gap-2">
                {tabsExist && (
                    <div className="flex  overflow-x-auto">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-3 !py-2 text-xs transition-colors font-sans ${activeTab === index
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                )}
                {!tabsExist && filename && (
                    <div className="flex justify-between items-center pt-2 pb-4">
                        <div className="text-sm font-medium font-mono text-zinc-400">{filename}</div>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
                        >
                            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                        </button>
                    </div>
                )}

                {!tabsExist && !filename && (
                    <div className="absolute top-0 w-full flex justify-end items-center px-8 py-4">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
                        >
                            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                        </button>
                    </div>
                )}
            </div>
            <SyntaxHighlighter
                language={activeLanguage}
                style={atomDark}
                customStyle={{
                    margin: 0,
                    padding: 0,
                    background: "transparent",
                    fontSize: "0.875rem",
                    width: "fit",
                    maxHeight: "400px",
                    msOverflowY: "scroll"
                }}
                wrapLines={false}
                showLineNumbers={showLineNumbers}
                lineProps={(lineNumber: number) => ({
                    style: {
                        backgroundColor: activeHighlightLines.includes(lineNumber)
                            ? "rgba(255,255,255,0.1)"
                            : "transparent",
                        display: "block",
                        width: "100%",
                    },
                })}
                PreTag="div"
            >
                {String(activeCode)}
            </SyntaxHighlighter>
        </div>
    );
};
