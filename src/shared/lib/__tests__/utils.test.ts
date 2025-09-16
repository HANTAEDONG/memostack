import { cn } from "@/shared/lib/cn";
import debounce from "@/shared/lib/debounce";
import throttle from "@/shared/lib/throttle";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("클래스명을 올바르게 병합해야 함", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("조건부 클래스명을 올바르게 처리해야 함", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional");
      expect(cn("base", false && "conditional")).toBe("base");
    });

    it("중복된 Tailwind 클래스를 올바르게 병합해야 함", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("빈 값들을 올바르게 처리해야 함", () => {
      expect(cn("", null, undefined, "valid")).toBe("valid");
    });

    it("객체 형태의 조건부 클래스를 올바르게 처리해야 함", () => {
      expect(
        cn({
          active: true,
          disabled: false,
          primary: true,
        })
      ).toBe("active primary");
    });

    it("배열 형태의 클래스를 올바르게 처리해야 함", () => {
      expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("지연 시간 후에 함수가 실행되어야 함", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1", "arg2");

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("연속 호출 시 마지막 호출만 실행되어야 함", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("first");
      debouncedFn("second");
      debouncedFn("third");

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("third");
    });

    it("이전 타이머를 취소하고 새로운 타이머를 설정해야 함", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("first");
      jest.advanceTimersByTime(50);

      debouncedFn("second");
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("second");
    });

    it("매개변수가 없는 함수도 올바르게 처리해야 함", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith();
    });
  });

  describe("throttle", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("첫 번째 호출은 즉시 실행되어야 함", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn("first");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("first");
    });

    it("대기 시간 내 연속 호출 시 마지막 호출이 저장되어야 함", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn("first");
      throttledFn("second");
      throttledFn("third");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("first");

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith("third");
    });

    it("대기 시간 후 새로운 호출은 즉시 실행되어야 함", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn("first");
      jest.advanceTimersByTime(100);
      throttledFn("second");

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, "first");
      expect(mockFn).toHaveBeenNthCalledWith(2, "second");
    });

    it("매개변수가 없는 함수도 올바르게 처리해야 함", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("복잡한 시나리오에서 올바르게 동작해야 함", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      // 첫 번째 호출 - 즉시 실행
      throttledFn("call1");
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 대기 시간 내 연속 호출들
      throttledFn("call2");
      throttledFn("call3");
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 대기 시간 경과
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(2, "call3");

      // 새로운 호출 - 즉시 실행
      throttledFn("call4");
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenNthCalledWith(3, "call4");
    });
  });
});
