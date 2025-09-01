import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mock 데이터 생성
const mockPosts = [
  {
    title: "React 18의 새로운 기능들",
    content:
      "React 18에서 도입된 Concurrent Features, Automatic Batching, Suspense on the Server 등 새로운 기능들을 자세히 살펴보겠습니다.",
    category: "프로그래밍",
    status: "Done",
  },
  {
    title: "일본 도쿄 여행 후기",
    content:
      "올해 봄에 다녀온 도쿄 여행의 추억을 정리해보았습니다. 아사쿠사, 시부야, 하라주쿠 등 주요 관광지를 돌아보며 느낀 점과 추천할 만한 장소들을 소개합니다.",
    category: "여행",
    status: "Done",
  },
  {
    title: "맛있는 홈베이킹 레시피",
    content:
      "집에서 쉽게 만들 수 있는 빵과 케이크 레시피를 공유합니다. 기본 재료만으로도 맛있는 베이킹을 즐길 수 있는 방법과 팁을 담았습니다.",
    category: "음식",
    status: "In Progress",
  },
  {
    title: "TypeScript 고급 타입 활용법",
    content:
      "TypeScript의 고급 타입 기능들을 실제 프로젝트에서 어떻게 활용할 수 있는지 예제와 함께 설명합니다.",
    category: "프로그래밍",
    status: "Done",
  },
  {
    title: "올해 읽은 책들",
    content:
      "2024년 상반기에 읽은 책들을 정리하고 추천합니다. 기술 서적부터 소설까지 다양한 장르의 책들을 소개하며, 각각의 인상 깊은 구절과 감상을 담았습니다.",
    category: "책",
    status: "Done",
  },
];

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

    // 포스트 데이터 생성
    let createdCount = 0;
    for (const post of mockPosts) {
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
