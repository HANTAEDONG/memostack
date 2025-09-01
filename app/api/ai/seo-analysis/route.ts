import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI 클라이언트 초기화 (서버 사이드에서만)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, content, targetKeywords = [] } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용이 필요합니다." },
        { status: 400 }
      );
    }
    // SEO 분석 프롬프트 생성
    const analysisPrompt = `다음 블로그 포스트의 SEO를 종합적으로 분석해주세요:
제목: "${title}"
콘텐츠: ${content.substring(0, 3000)}...
타겟 키워드: ${
      targetKeywords.length > 0 ? targetKeywords.join(", ") : "지정되지 않음"
    }

다음 항목들을 종합적으로 평가해주세요:

1. 제목 최적화 (길이, 키워드 포함, 클릭률)
2. 콘텐츠 품질 (가독성, 구조, 키워드 밀도)
3. 기술적 SEO (제목 구조, 내부 링크, 이미지)
4. 키워드 전략 (주요 키워드, 롱테일 키워드, 키워드 갭)
5. 사용자 경험 (가독성, 구조, 정보 전달)

응답은 반드시 다음 JSON 형식으로, 각 점수는 0~100 범위로 제공해야 합니다:
{
  "score": 85,
  "grade": "B",
  "summary": "전체적으로 좋은 SEO를 보여주지만 몇 가지 개선점이 있습니다.",
  "improvements": [
    {
      "category": "title",
      "priority": "high",
      "description": "제목이 너무 길어 검색 결과에서 잘릴 수 있습니다.",
      "suggestion": "제목을 60자 이내로 줄이세요.",
      "impact": "검색 결과 클릭률 향상"
    }
  ],
  "keywordAnalysis": {
    "primaryKeywords": ["주요키워드1", "주요키워드2"],
    "secondaryKeywords": ["보조키워드1", "보조키워드2"],
    "keywordDensity": {"키워드1": 2.5},
    "keywordGaps": ["누락된키워드1"],
    "keywordOpportunities": ["추가하면좋은키워드1"]
  },
  "readabilityScore": 75,
  "technicalScore": 80,
  "contentScore": 85
}`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "당신은 SEO 전문가입니다. 블로그 포스트의 SEO를 분석하고 점수를 매기며 구체적인 개선 제안을 해주세요.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      throw new Error("AI 응답을 받지 못했습니다.");
    }

    // 마크다운 코드 블록 제거 및 JSON 파싱
    try {
      // ```json과 ``` 제거
      let cleanResult = result.trim();
      if (cleanResult.startsWith("```json")) {
        cleanResult = cleanResult.replace(/^```json\s*/, "");
      }
      if (cleanResult.startsWith("```")) {
        cleanResult = cleanResult.replace(/^```\s*/, "");
      }
      if (cleanResult.endsWith("```")) {
        cleanResult = cleanResult.replace(/\s*```$/, "");
      }

      const parsedResult = JSON.parse(cleanResult);
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error("SEO 분석 결과 파싱 실패:", parseError);
      console.error("원본 응답:", result);
      return NextResponse.json(
        { error: "AI 응답을 파싱할 수 없습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("SEO 분석 중 오류 발생:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "알 수 없는 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
