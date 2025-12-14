import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, FileText, Link as LinkIcon, Printer, ScrollText } from "lucide-react";
import { legalDocs, legalDocList } from "./config";

const slugify = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\- ]/gu, "")
    .replace(/\s+/g, "-");

const buildToc = (markdown) => {
  const lines = markdown.split("\n");
  const toc = [];
  const counts = new Map();
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (trimmed.startsWith("## ")) {
      const title = trimmed.replace(/^##\s+/, "").trim();
      const base = slugify(title);
      const count = counts.get(base) ?? 0;
      const id = count === 0 ? base : `${base}-${count}`;
      counts.set(base, count + 1);
      toc.push({ id, title, level: 2 });
    } else if (trimmed.startsWith("### ")) {
      const title = trimmed.replace(/^###\s+/, "").trim();
      const base = slugify(title);
      const count = counts.get(base) ?? 0;
      const id = count === 0 ? base : `${base}-${count}`;
      counts.set(base, count + 1);
      toc.push({ id, title, level: 3 });
    }
  }
  return toc;
};

const LegalDocPage = ({ docKey }) => {
  const doc = legalDocs[docKey] ?? legalDocs.terms;

  const { toc, counts } = useMemo(() => {
    const tocItems = buildToc(doc.content);
    return { toc: tocItems, counts: new Map() };
  }, [doc.content]);

  const renderers = useMemo(
    () => ({
      h2({ node, children, ...props }) {
        const title = children?.[0]?.toString?.() ?? "";
        const base = slugify(title);
        const current = counts.get(base) ?? 0;
        const id = current === 0 ? base : `${base}-${current}`;
        counts.set(base, current + 1);
        return (
          <h2 id={id} {...props} className="scroll-mt-24 text-2xl font-black text-slate-800 mt-10 mb-3 flex items-center gap-2">
            <a href={`#${id}`} className="text-slate-300 hover:text-[#5fbb4e] no-print">
              <LinkIcon size={16} />
            </a>
            <span>{children}</span>
          </h2>
        );
      },
      h3({ node, children, ...props }) {
        const title = children?.[0]?.toString?.() ?? "";
        const base = slugify(title);
        const current = counts.get(base) ?? 0;
        const id = current === 0 ? base : `${base}-${current}`;
        counts.set(base, current + 1);
        return (
          <h3 id={id} {...props} className="scroll-mt-24 text-xl font-bold text-slate-800 mt-6 mb-2 flex items-center gap-2">
            <a href={`#${id}`} className="text-slate-300 hover:text-[#5fbb4e] no-print">
              <LinkIcon size={14} />
            </a>
            <span>{children}</span>
          </h3>
        );
      },
      a({ node, ...props }) {
        return (
          <a
            {...props}
            className="text-[#5865F2] font-semibold underline underline-offset-2"
            target={props.href?.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
          />
        );
      },
      ul({ node, ...props }) {
        return <ul className="list-disc pl-5 space-y-1" {...props} />;
      },
      ol({ node, ...props }) {
        return <ol className="list-decimal pl-5 space-y-1" {...props} />;
      },
      p({ node, ...props }) {
        return <p className="leading-relaxed text-slate-700" {...props} />;
      },
      strong({ node, ...props }) {
        return <strong className="font-bold text-slate-800" {...props} />;
      },
    }),
    [counts]
  );

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <main className="container mx-auto px-4 md:px-6 py-14 max-w-5xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <a
            href="/legal"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#5fbb4e] no-print"
          >
            <ArrowLeft size={18} />
            一覧に戻る
          </a>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-full bg-white border border-slate-200 flex items-center gap-1">
              <FileText size={14} className="text-[#5fbb4e]" />
              {doc.updatedAt} 改定
            </span>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#5fbb4e] hover:border-[#5fbb4e] font-semibold flex items-center gap-2 no-print"
            >
              <Printer size={16} />
              印刷
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#5fbb4e] font-black uppercase tracking-wide text-sm">
                <ScrollText size={18} />
                Legal Document
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-1 mb-2">{doc.title}</h1>
              <p className="text-sm md:text-base text-slate-600">{doc.description}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600">
              <div>最終改定日: <span className="font-bold text-slate-800">{doc.updatedAt}</span></div>
              <div>適用開始日: <span className="font-bold text-slate-800">{doc.effectiveAt}</span></div>
              <div>固定URL: <code className="text-[11px] bg-white border border-slate-200 px-2 py-1 rounded">{doc.path}</code></div>
            </div>
          </div>

          {toc.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
              <div className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <LinkIcon size={16} className="text-[#5fbb4e]" />
                目次
              </div>
              <div className="flex flex-col gap-1 text-sm text-slate-600">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`hover:text-[#5fbb4e] ${item.level === 3 ? "pl-4 text-xs" : ""}`}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <article className="prose max-w-none prose-slate">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
              {doc.content}
            </ReactMarkdown>
          </article>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 no-print">
          {legalDocList.map((item) => (
            <a
              key={item.key}
              href={item.path}
              className={`border rounded-2xl p-4 shadow-sm transition-colors ${
                item.key === doc.key ? "border-[#5fbb4e]/60 bg-white" : "border-slate-200 bg-white hover:border-[#5fbb4e]/50"
              }`}
            >
              <div className="text-xs font-bold text-slate-500 mb-1">{item.updatedAt} 改定</div>
              <div className="text-lg font-black text-slate-900 mb-1">{item.title}</div>
              <div className="text-xs text-slate-600 leading-relaxed">{item.description}</div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LegalDocPage;
