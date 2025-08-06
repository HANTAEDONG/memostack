const extractTitleFromContent = (content: string): string => {
  const stripHtml = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };
  const cleanContent = stripHtml(content);
  const lines = cleanContent.split("\n");
  const firstLine = lines[0].trim();
  if (firstLine.length === 0) {
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        return line.length <= 50 ? line : line.substring(0, 50);
      }
    }
    return "Untitled";
  }
  return firstLine.length <= 50 ? firstLine : firstLine.substring(0, 50);
};

export default extractTitleFromContent;
