import { serverFetch } from "@/lib/server-api";
import { WorkspaceAccount } from "./workspace-account";

export default async function WorkspaceAccountPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const res = await serverFetch(`/api/workspaces/${workspaceId}`);

  return <WorkspaceAccount workspace={res.workspace} />;
}