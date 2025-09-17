### 자동저장(디바운스)로 최신 값이 저장되지 않는 문제

- **이슈 제목**: 에디터 자동저장 시 마지막 입력이 아닌 이전 값이 저장됨
- **영향 범위**: `/write` 페이지의 제목/내용/카테고리 자동 저장 흐름
- **증상**:
  - "1" 입력 → 잠시 후 "2" 입력 → 자동 저장은 1로 호출
  - 이후 "3" 입력 → 자동 저장은 2로 호출
  - 최종적으로 서버에는 최신값(3) 대신 과거 값이 반영됨

#### 원인 분석

1. 디바운스 중복 적용

   - `CreatePostForm.tsx`에서 디바운스
   - `useEditPost.ts`에서 다시 디바운스 → 타이밍 간섭으로 오래된 값 저장

2. 과거 상태 캡처(클로저 이슈)
   - 디바운스 지연 동안 상태가 바뀌지만, 저장 함수가 생성 시점의 `postData`를 참조하여 호출됨

#### 해결 전략

1. 디바운스 단일화(단일 책임 원칙)

   - 폼 레이어에서 디바운스를 제거하고, 훅(`useEditPost`)에서만 디바운스 수행

2. 최신 값 보장(ref 사용)

   - `postDataRef`로 최신 입력값을 유지하고, 저장 시 `ref.current`를 사용

3. 지연 시간 재설정
   - UX와 요청 빈도 균형을 고려해 1200ms로 조정(필요 시 800–1500ms 범위 튜닝 권장)

#### 적용 변경 요약

```tsx
// src/features/EditPost/ui/CreatePostForm.tsx
// 디바운스 제거, 훅이 단일하게 처리
<Tiptap
  title={title}
  content={content}
  onTitleChange={onTitleChange}
  onContentChange={onContentChange}
/>
```

```ts
// src/features/EditPost/model/useEditPost.ts (발췌)
import { useRef } from "react";

const postDataRef = useRef(postData);
useEffect(() => {
  postDataRef.current = postData;
}, [postData]);

const updateDraft = useCallback(async () => {
  if (!user?.id || !finalPostId) return false;
  const current = postDataRef.current;
  return !!(await EditPostService.updateDraft(
    finalPostId,
    {
      title: current.title,
      content: current.content,
      category: (current.category || "general") as Category,
    },
    user.id
  ));
}, [finalPostId, user?.id]);

const debouncedAutoSave = useMemo(
  () =>
    debounce(() => {
      if (!finalPostId) return;
      const current = postDataRef.current;
      if (current.title.trim() || current.content.trim()) updateDraft();
    }, 1200),
  [updateDraft, finalPostId]
);
```

#### 회귀 방지 체크리스트

- 폼에서 디바운스를 다시 추가하지 않는다
- 저장 함수 의존성에 입력 상태를 직접 넣지 않는다(최신 값은 `ref`로 읽기)
- 디바운스 콜백 내부에서도 항상 `ref.current`를 사용
- 에디터 onChange는 상태 업데이트만 수행(저장 트리거는 훅에서 관리)

#### 검증 시나리오

1. 빠르게 1→2→3 입력 후 멈춤 → 서버에는 3이 저장되어야 함
2. 천천히 1 입력, 1.2초 대기, 2 입력, 1.2초 대기 → 각 시점의 최신 값이 저장되어야 함
3. 제목만/본문만 수정 등 부분 수정도 동일하게 동작

#### 참고

- 현재 디바운스 지연: 1200ms (`useEditPost` 내부)
- 조정이 필요하면 한 곳(해당 훅)에서만 변경할 것

---

### 목록 → 편집 재진입 시 이전 화면이 보이는 문제 (React Query 캐시)

- **이슈 제목**: 작성 중 목록으로 이동했다가 다시 편집 화면으로 돌아오면, 최신 데이터가 아닌 이전 요청 결과가 먼저 렌더링됨
- **증상**:
  - 편집 화면 재진입 시 직전 자동저장 이전의 값이 먼저 보이고, 새로고침해야 최신화됨
- **원인**:
  - React Query가 기존 상세 데이터를 캐시에서 즉시 제공하고, `staleTime`이 길거나 `refetchOnMount`가 기본 값이라 재조회 타이밍이 늦음
- **해결**:
  - 상세 조회 훅에서 최초 마운트 시 항상 서버 재조회하고, stale 즉시 처리

```ts
// src/entities/Post/model/usePostQuery.ts (발췌)
export const usePostById = (id?: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => PostAPI.getPostById(id!),
    enabled: !!id,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: (failureCount, error) => {
      /* 동일 */
    },
  });
};
```

- **효과**:

  - 편집 화면 진입 시 즉시 서버에서 최신 데이터로 동기화되어 새로고침 없이 최신 값이 표시됨

- **회귀 방지 체크**:
  - 상세 페이지로 재진입하는 모든 경로(리스트 클릭, 내부 링크)를 테스트
  - 업데이트 성공 시 `invalidateQueries({ queryKey: ["post", id] })` 또는 `setQueryData`로 상세 캐시 일관성 유지
