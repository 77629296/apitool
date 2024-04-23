// Languages
export type Language = {
  id: string;
  name: string;
  locale: string;
  editorCode: string;
  progress?: number;
};

export const languages: Language[] = [
  {
    id: "zh-CN",
    name: "Chinese Simplified",
    editorCode: "zhcn",
    locale: "zh-CN",
  },
  {
    id: "zh-TW",
    name: "Chinese Traditional",
    editorCode: "zhtw",
    locale: "zh-TW",
  },
  {
    id: "en",
    name: "English",
    editorCode: "en",
    locale: "en-US",
  },
];
