import { getWorkspaceServer } from "@/features/workspace/api/workspace-server-api";
import { WorkspaceDeleteButton } from "@features/workspace/components/workspace-delete-button";
import { WorkspaceEditForm } from "@features/workspace/components/workspace-edit-form";

export default async function WorkspaceAccountPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceServer(workspaceId);

  return (
    <div className="max-h-screen justify-center bg-[#1d1d1d] overflow-y-scroll custom-scrollbar">
      <div className="w-full px-8 py-8 mb-10 relative">
        <h1 className="text-white mb-6" style={{ fontSize: 22, fontWeight: 700 }}>
          Параметры рабочего пространства
        </h1>

        <WorkspaceEditForm workspace={workspace} />

        <Section title="Видимость рабочего пространства">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="5" width="8" height="6" rx="1" stroke="#f87168" strokeWidth="1.2" />
                <path d="M4 5V3.5a2 2 0 014 0V5" stroke="#f87168" strokeWidth="1.2" />
              </svg>
              <span style={{ color: "#9fA6b2", fontSize: 14 }}>
                Приватное – Это рабочее пространство приватное. Оно не индексируется и не видно тем, кто находится вне рабочего пространства.
              </span>
            </div>
            <OutlineButton>Изменить</OutlineButton>
          </div>
        </Section>

        {/* <Section title="Связывание Slack рабочих пространств">
          <div className="flex items-start justify-between py-3">
            <div>
              <p style={{ color: "#9fA6b2", fontSize: 14 }}>
                Свяжите ваши рабочие пространства Slack и Trello вместе для совместной работы над проектами Trello прямо в Slack.
              </p>
              <a href="#" style={{ color: "#579dff", fontSize: 14 }} className="hover:underline">
                Узнайте больше.
              </a>
            </div>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded border ml-4 shrink-0"
              style={{ borderColor: "#4a5568", color: "#b6c2cf", background: "transparent", fontSize: 14 }}
            >
              <SlackIcon />
              Добавить в Slack
            </button>
          </div>
        </Section> */}

        <div
          className="flex items-center justify-between px-4 py-3 mt-2"
          style={{ background: "#2d1b69", borderRadius: "6px 6px 0 0" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>✨</span>
            <span style={{ color: "#ccc", fontSize: 14 }}>
              <strong style={{ color: "#fff" }}>Перейти на премиум</strong> для большего количества параметров
            </span>
          </div>
          <button
            className="px-4 py-1.5 rounded text-white"
            style={{ background: "#0c66e4", fontSize: 14 }}
          >
            Обновить
          </button>
        </div>

        <div className="px-6 pb-4" style={{ background: "#1e1230", borderRadius: "0 0 6px 6px" }}>
          <PremiumSection title="Ограничения на членство в рабочем пространстве">
            <div className="flex items-center justify-between py-3">
              <span style={{ color: "#9fA6b2", fontSize: 14 }}>
                Кто угодно может быть добавлен в это рабочее пространство.
              </span>
              <GrayButton>Изменить</GrayButton>
            </div>
          </PremiumSection>

          <PremiumSection title="Ограничения на создание досок">
            <div className="flex items-start justify-between py-3">
              <div className="space-y-1">
                <p style={{ color: "#9fA6b2", fontSize: 14 }}>Любой член рабочего пространства может создавать <span style={{ color: "#4bce97" }}>🌐</span> публичные доски.</p>
                <p style={{ color: "#9fA6b2", fontSize: 14 }}>Любой член рабочего пространства может создавать <span style={{ color: "#f5cd47" }}>👥</span> видимые в рабочем пространстве доски.</p>
                <p style={{ color: "#9fA6b2", fontSize: 14 }}>Любой член рабочего пространства может создавать <span style={{ color: "#f87168" }}>🔒</span> приватные доски.</p>
              </div>
              <GrayButton>Изменить</GrayButton>
            </div>
          </PremiumSection>

          <PremiumSection title="Ограничения на удаление досок">
            <div className="flex items-start justify-between py-3">
              <div className="space-y-1">
                <p style={{ color: "#9fA6b2", fontSize: 14 }}>Любой член рабочего пространства может удалять <span style={{ color: "#4bce97" }}>🌐</span> публичные доски.</p>
                <p style={{ color: "#9fA6b2", fontSize: 14 }}>Любой член рабочего пространства может удалять <span style={{ color: "#f5cd47" }}>👥</span> видимые в рабочем пространстве доски.</p>
                <p style={{ color: "#9fA6b2", fontSize: 14 }}>Любой член рабочего пространства может удалять <span style={{ color: "#f87168" }}>🔒</span> приватные доски.</p>
              </div>
              <GrayButton>Изменить</GrayButton>
            </div>
          </PremiumSection>

          <PremiumSection title="Общее доступ к доскам с гостями">
            <div className="flex items-center justify-between py-3">
              <span style={{ color: "#9fA6b2", fontSize: 14 }}>
                Кто угодно может отправлять и получать приглашения на доски в этом рабочем пространстве.
              </span>
              <GrayButton>Изменить</GrayButton>
            </div>
          </PremiumSection>

          <PremiumSection title="Ограничения на рабочие пространства Slack">
            <div className="flex items-center justify-between py-3">
              <span style={{ color: "#9fA6b2", fontSize: 14 }}>
                Любой член рабочего пространства может связывать и отвязывать это рабочее пространство Trello с рабочими пространствами Slack.
              </span>
              <GrayButton>Изменить</GrayButton>
            </div>
          </PremiumSection>
        </div>

        <div className="mt-8">
          <WorkspaceDeleteButton workspaceId={workspace.id} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-white mb-1" style={{ fontSize: 15, fontWeight: 700 }}>{title}</h2>
      <div style={{ borderTop: "1px solid #2c333a" }}>{children}</div>
    </div>
  );
}

function PremiumSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 py-2">
        <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
        <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="5" width="8" height="6" rx="1" stroke="#9f7dff" strokeWidth="1.2" />
          <path d="M4 5V3.5a2 2 0 014 0V5" stroke="#9f7dff" strokeWidth="1.2" />
        </svg>
      </div>
      <div style={{ borderTop: "1px solid #3d2e6b" }}>{children}</div>
    </div>
  );
}

function OutlineButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="px-3 py-1.5 rounded border shrink-0"
      style={{ borderColor: "#4a5568", color: "#b6c2cf", background: "transparent", fontSize: 14 }}
    >
      {children}
    </button>
  );
}

function GrayButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="px-3 py-1.5 rounded shrink-0 ml-4 cursor-not-allowed"
      style={{ color: "#4a5568", background: "transparent", fontSize: 14 }}
    >
      {children}
    </button>
  );
}

// function SlackIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//       <rect x="1" y="6" width="3" height="4" rx="1.5" fill="#36c5f0" />
//       <rect x="6" y="1" width="4" height="3" rx="1.5" fill="#2eb67d" />
//       <rect x="12" y="6" width="3" height="4" rx="1.5" fill="#ecb22e" />
//       <rect x="6" y="12" width="4" height="3" rx="1.5" fill="#e01e5a" />
//       <rect x="6" y="6" width="4" height="4" rx="0.5" fill="#ddd" />
//     </svg>
//   );
// }