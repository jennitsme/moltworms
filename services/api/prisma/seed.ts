import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@moltworms.local" },
    update: {},
    create: {
      email: "demo@moltworms.local",
      name: "Demo User",
    },
  });

  await prisma.channel.upsert({
    where: { id: "demo-email" },
    update: {},
    create: {
      id: "demo-email",
      type: "email",
      label: "Demo Email",
      config: { host: "imap.example.com" },
      userId: user.id,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
