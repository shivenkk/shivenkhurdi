import { updates } from "@/lib/data";

export default function UpdatesPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`w-[300px] select-none ${className}`}>
      <p className="hud-label mb-3 text-fg-dim">Updates</p>
      <ul className="flex flex-col gap-3">
        {updates.map((u) => (
          <li key={u.title} className="flex flex-col gap-1">
            <span className="hud text-fg-faint">{u.date}</span>
            {u.href ? (
              <a
                href={u.href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-sans text-[14px] leading-snug text-fg transition-colors hover:text-violet-soft"
              >
                {u.title}
              </a>
            ) : (
              <span className="font-sans text-[14px] leading-snug text-fg">{u.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
