import { prisma } from "@/lib/prisma";

const workspaceTypes = [
  { key: "engineering", label: "Инженерия / ИТ", group: "Работа" },
  { key: "marketing", label: "Маркетинг", group: "Работа" },
  { key: "education", label: "Образование", group: "Сфера" },
  { key: "sales", label: "Продажи", group: "Бизнес" },
  { key: "hr", label: "Кадры", group: "Бизнес" },
  { key: "other", label: "Другое" },
];

async function main() {
  for (const type of workspaceTypes) {
    await prisma.workspaceType.upsert({
      where: { key: type.key }, 
      update: {},              
      create: type,
    });
  }

  console.log("Workspace types seeded ✅");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });