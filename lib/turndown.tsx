"use client";

import TurndownService from "turndown";

export const turndownService = new TurndownService();

export const translateToHtml = (input: string): string => {
  let html = input;

  // Replace line breaks with <br>
  html = html.replace(/\[br\]/g, "<br />");

  // Replace paragraphs
  html = html.replace(/\[p\](.*?)\[\/p\]/g, "<p>$1</p>");

  // Replace strong tags
  html = html.replace(/\[strong\](.*?)\[\/strong\]/g, "<strong>$1</strong>");

  // Replace underline
  html = html.replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>");

  // Replace italic and emphasis
  html = html.replace(/\[(i|em)\](.*?)\[\/(i|em)\]/g, "<i>$2</i>");

  // Replace unordered and ordered lists
  html = html.replace(/\[ul\](.*?)\[\/ul\]/gs, "<ul>$1</ul>");
  html = html.replace(/\[ol\](.*?)\[\/ol\]/gs, "<ol>$1</ol>");
  html = html.replace(/\[li\](.*?)\[\/li\]/g, "<li>$1</li>");

  // Replace headers h1, h2, h3, ...
  html = html.replace(/\[h(\d)\](.*?)\[\/h\1\]/g, "<h$1>$2</h$1>");

  // Replace [hr] with <hr />
  html = html.replace(/\[hr\]/g, "<hr />");

  // Replace URLs with rel="noopener noreferrer" for security and style="text-decoration: underline;" for underline
  html = html.replace(
    /\[url\](.*?)\|(.*?)\[\/url\]/g,
    '<a href="$1" rel="noopener noreferrer" style="text-decoration: underline;">$2</a>'
  );
  html = html.replace(
    /\[url\](.*?)\[\/url\]/g,
    '<a href="$1" rel="noopener noreferrer" style="text-decoration: underline;">$1</a>'
  );

  return html;
};

export const formatDataOnPaste = async (
  e: any,
  setInput: (input: string) => void
) => {
  // Check if the clipboard contains HTML
  if (e.clipboardData && e.clipboardData.types.indexOf("text/html") > -1) {
    e.preventDefault();

    // Get HTML content from clipboard
    const htmlContent = e.clipboardData.getData("text/html");

    // Convert to markdown
    const markdownText = turndownService.turndown(htmlContent);

    // set input to markdown
    setInput(markdownText);
  }
};
