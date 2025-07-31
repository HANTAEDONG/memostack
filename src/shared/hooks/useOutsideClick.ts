import { useEffect } from "react";

const useOutsideClick = (
  ref: React.RefObject<HTMLElement> | undefined,
  handler: () => void
) => {
  useEffect(() => {
    if (!ref) return;

    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};

export default useOutsideClick;
