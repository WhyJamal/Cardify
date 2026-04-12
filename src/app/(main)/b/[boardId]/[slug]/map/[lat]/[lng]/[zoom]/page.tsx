import { redirect } from "next/navigation";

export default async function Page({ params }: {  params: Promise<{ boardId: number; slug: string; lat: string; lng: string; zoom: string; }> }) {
  const { boardId, slug, lat, lng, zoom } = await params;

  redirect(`/b/${boardId}/${slug}?openMap=${lat},${lng},${zoom}`);
}