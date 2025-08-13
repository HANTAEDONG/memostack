import { PrismaClient } from "@prisma/client";
import data from "../src/entities/Post/lib/data.json";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔄 데이터베이스 연결 테스트...");
    await prisma.$connect();
    console.log("✅ 데이터베이스 연결 성공!");

    console.log("🔄 데이터베이스 시드 시작...");

    // 기존 데이터 삭제
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        id: "cme9e3m7q00009w8chdkcmna8",
        email: "user@example.com",
        name: "테스트 사용자",
      },
    });

    console.log("✅ 사용자 생성 완료:", user.email);

    // 포스트 데이터 변환 및 생성
    let createdCount = 0;
    for (const post of data) {
      await prisma.post.create({
        data: {
          title: post.title,
          content: post.content,
          authorId: user.id,
          category: post.category,
          status: post.status,
        },
      });
      createdCount++;
    }

    console.log(`✅ ${createdCount}개의 포스트 생성 완료!`);
    console.log("✅ 시드 완료!");
  } catch (error) {
    console.error("❌ 시드 실패:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
