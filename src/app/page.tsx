"use client";

import { useState } from "react";

export default function Home() {
  const [repoName, setRepoName] = useState("my-new-repo");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [copied, setCopied] = useState(false);

  const hasSpaces = repoName.includes(" ");
  const command = `gh repo create ${repoName || "my-new-repo"} --template uratmangun/kiro-nextjs --${visibility} --clone`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Clone this template
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Use the GitHub CLI to create a new repository from this template:
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Repository name"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${hasSpaces
                  ? "border-amber-500 focus:border-amber-500 focus:ring-amber-500"
                  : "border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:focus:border-emerald-500"
                }`}
            />
            {hasSpaces && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Repository names cannot contain spaces. Use hyphens instead.
              </p>
            )}
          </div>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "public" | "private")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="relative rounded-lg bg-zinc-900 p-4 dark:bg-zinc-800">
          <code className="block pr-10 text-sm text-emerald-400">
            {command}
          </code>
          <button
            type="button"
            onClick={copyToClipboard}
            className="absolute right-2 top-2 rounded p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
            aria-label="Copy command"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <p>Options:</p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>
              <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                --public
              </code>{" "}
              — Create a public repository
            </li>
            <li>
              <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                --private
              </code>{" "}
              — Create a private repository
            </li>
            <li>
              <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                --clone
              </code>{" "}
              — Clone the new repository locally
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
