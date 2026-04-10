import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HomePageClient } from "@features/home/components/home-page-client";
//import { CardWithDetails } from "@shared/types";
import { serverFetch } from "@/lib/server-api";
import { CardData } from "@/shared/types";

async function getHomePageData(userId: string): Promise<{
  attentionCards: CardData[];
  highlightCards: CardData[];
}> {


  const [attentionCards, highlightCards] = await Promise.all([
    serverFetch("/api/user/tasks?type=attention"),
    serverFetch("/api/user/tasks?type=highlights"),
  ]);

  return {
    attentionCards: (attentionCards as any).cards ?? [],
    highlightCards: (highlightCards as any).cards ?? [],
  };
}

export default async function RootPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) redirect("/auth/sign-in");

  const { attentionCards, highlightCards } = await getHomePageData(dbUser.id);

  return (
    <HomePageClient
      userId={dbUser.id}
      initialAttentionCards={attentionCards}
      initialHighlightCards={highlightCards}
    />
  );
}