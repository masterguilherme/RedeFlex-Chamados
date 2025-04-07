// Função para verificar se é uma imagem
export const isImage = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// Função para verificar se é um documento
export const isDocument = (file: File): boolean => {
  return file.type.startsWith('application/') || file.type.startsWith('text/');
};

// Função para verificar se é um vídeo
export const isVideo = (file: File): boolean => {
  return file.type.startsWith('video/');
};

// Função para verificar se é um áudio
export const isAudio = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

// Função para verificar se é um PDF
export const isPDF = (file: File): boolean => {
  return file.type === 'application/pdf';
};

// Função para verificar se é um arquivo Excel
export const isExcel = (file: File): boolean => {
  return (
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
};

// Função para verificar se é um arquivo Word
export const isWord = (file: File): boolean => {
  return (
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
};

// Função para verificar se é um arquivo PowerPoint
export const isPowerPoint = (file: File): boolean => {
  return (
    file.type === 'application/vnd.ms-powerpoint' ||
    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  );
};

// Função para verificar se é um arquivo compactado
export const isCompressed = (file: File): boolean => {
  return (
    file.type === 'application/zip' ||
    file.type === 'application/x-rar-compressed' ||
    file.type === 'application/x-7z-compressed'
  );
};

// Função para verificar se é um arquivo executável
export const isExecutable = (file: File): boolean => {
  return (
    file.type === 'application/x-msdownload' ||
    file.type === 'application/x-msdos-program' ||
    file.type === 'application/x-msdownload' ||
    file.type === 'application/x-dosexec' ||
    file.type === 'application/x-executable'
  );
};

// Função para verificar se é um arquivo de texto
export const isText = (file: File): boolean => {
  return file.type.startsWith('text/');
};

// Função para verificar se é um arquivo JSON
export const isJSON = (file: File): boolean => {
  return file.type === 'application/json';
};

// Função para verificar se é um arquivo XML
export const isXML = (file: File): boolean => {
  return file.type === 'application/xml' || file.type === 'text/xml';
};

// Função para verificar se é um arquivo CSV
export const isCSV = (file: File): boolean => {
  return file.type === 'text/csv';
};

// Função para verificar se é um arquivo HTML
export const isHTML = (file: File): boolean => {
  return file.type === 'text/html';
};

// Função para verificar se é um arquivo CSS
export const isCSS = (file: File): boolean => {
  return file.type === 'text/css';
};

// Função para verificar se é um arquivo JavaScript
export const isJavaScript = (file: File): boolean => {
  return file.type === 'text/javascript' || file.type === 'application/javascript';
};

// Função para verificar se é um arquivo TypeScript
export const isTypeScript = (file: File): boolean => {
  return file.type === 'text/typescript' || file.type === 'application/typescript';
};

// Função para verificar se é um arquivo Markdown
export const isMarkdown = (file: File): boolean => {
  return file.type === 'text/markdown' || file.type === 'text/x-markdown';
};

// Função para verificar se é um arquivo YAML
export const isYAML = (file: File): boolean => {
  return file.type === 'text/yaml' || file.type === 'application/x-yaml';
};

// Função para verificar se é um arquivo TOML
export const isTOML = (file: File): boolean => {
  return file.type === 'text/toml' || file.type === 'application/toml';
};

// Função para verificar se é um arquivo INI
export const isINI = (file: File): boolean => {
  return file.type === 'text/ini' || file.type === 'application/x-ini';
};

// Função para verificar se é um arquivo de configuração
export const isConfig = (file: File): boolean => {
  return (
    isJSON(file) ||
    isYAML(file) ||
    isTOML(file) ||
    isINI(file) ||
    file.name.endsWith('.config') ||
    file.name.endsWith('.conf')
  );
};

// Função para verificar se é um arquivo de código fonte
export const isSourceCode = (file: File): boolean => {
  return (
    isJavaScript(file) ||
    isTypeScript(file) ||
    isHTML(file) ||
    isCSS(file) ||
    isMarkdown(file) ||
    file.name.endsWith('.js') ||
    file.name.endsWith('.ts') ||
    file.name.endsWith('.jsx') ||
    file.name.endsWith('.tsx') ||
    file.name.endsWith('.html') ||
    file.name.endsWith('.css') ||
    file.name.endsWith('.md')
  );
};

// Função para verificar se é um arquivo de documento
export const isDocumentFile = (file: File): boolean => {
  return (
    isPDF(file) ||
    isWord(file) ||
    isExcel(file) ||
    isPowerPoint(file) ||
    isText(file) ||
    isMarkdown(file)
  );
};

// Função para verificar se é um arquivo de mídia
export const isMedia = (file: File): boolean => {
  return isImage(file) || isVideo(file) || isAudio(file);
};

// Função para verificar se é um arquivo de dados
export const isData = (file: File): boolean => {
  return (
    isJSON(file) ||
    isXML(file) ||
    isCSV(file) ||
    isExcel(file) ||
    isConfig(file)
  );
};

// Função para verificar se é um arquivo compactado
export const isArchive = (file: File): boolean => {
  return isCompressed(file);
};

// Função para verificar se é um arquivo executável
export const isBinary = (file: File): boolean => {
  return isExecutable(file);
};

// Função para verificar se é um arquivo de texto
export const isTextFile = (file: File): boolean => {
  return isText(file) || isSourceCode(file) || isConfig(file);
};

// Função para verificar se é um arquivo de imagem
export const isImageFile = (file: File): boolean => {
  return isImage(file);
};

// Função para verificar se é um arquivo de vídeo
export const isVideoFile = (file: File): boolean => {
  return isVideo(file);
};

// Função para verificar se é um arquivo de áudio
export const isAudioFile = (file: File): boolean => {
  return isAudio(file);
};

// Função para verificar se é um arquivo PDF
export const isPDFFile = (file: File): boolean => {
  return isPDF(file);
};

// Função para verificar se é um arquivo Excel
export const isExcelFile = (file: File): boolean => {
  return isExcel(file);
};

// Função para verificar se é um arquivo Word
export const isWordFile = (file: File): boolean => {
  return isWord(file);
};

// Função para verificar se é um arquivo PowerPoint
export const isPowerPointFile = (file: File): boolean => {
  return isPowerPoint(file);
};

// Função para verificar se é um arquivo compactado
export const isCompressedFile = (file: File): boolean => {
  return isCompressed(file);
};

// Função para verificar se é um arquivo executável
export const isExecutableFile = (file: File): boolean => {
  return isExecutable(file);
};

// Função para verificar se é um arquivo de texto
export const isTextOnlyFile = (file: File): boolean => {
  return isText(file);
};

// Função para verificar se é um arquivo JSON
export const isJSONFile = (file: File): boolean => {
  return isJSON(file);
};

// Função para verificar se é um arquivo XML
export const isXMLFile = (file: File): boolean => {
  return isXML(file);
};

// Função para verificar se é um arquivo CSV
export const isCSVFile = (file: File): boolean => {
  return isCSV(file);
};

// Função para verificar se é um arquivo HTML
export const isHTMLFile = (file: File): boolean => {
  return isHTML(file);
};

// Função para verificar se é um arquivo CSS
export const isCSSFile = (file: File): boolean => {
  return isCSS(file);
};

// Função para verificar se é um arquivo JavaScript
export const isJavaScriptFile = (file: File): boolean => {
  return isJavaScript(file);
};

// Função para verificar se é um arquivo TypeScript
export const isTypeScriptFile = (file: File): boolean => {
  return isTypeScript(file);
};

// Função para verificar se é um arquivo Markdown
export const isMarkdownFile = (file: File): boolean => {
  return isMarkdown(file);
};

// Função para verificar se é um arquivo YAML
export const isYAMLFile = (file: File): boolean => {
  return isYAML(file);
};

// Função para verificar se é um arquivo TOML
export const isTOMLFile = (file: File): boolean => {
  return isTOML(file);
};

// Função para verificar se é um arquivo INI
export const isINIFile = (file: File): boolean => {
  return isINI(file);
};

// Função para verificar se é um arquivo de configuração
export const isConfigFile = (file: File): boolean => {
  return isConfig(file);
};

// Função para verificar se é um arquivo de código fonte
export const isSourceCodeFile = (file: File): boolean => {
  return isSourceCode(file);
};

// Função para verificar se é um arquivo de documento
export const isDocumentFileType = (file: File): boolean => {
  return isDocumentFile(file);
};

// Função para verificar se é um arquivo de mídia
export const isMediaFile = (file: File): boolean => {
  return isMedia(file);
};

// Função para verificar se é um arquivo de dados
export const isDataFile = (file: File): boolean => {
  return isData(file);
};

// Função para verificar se é um arquivo compactado
export const isArchiveFile = (file: File): boolean => {
  return isArchive(file);
};

// Função para verificar se é um arquivo executável
export const isBinaryFile = (file: File): boolean => {
  return isBinary(file);
};

// Função para verificar se é um arquivo de texto
export const isTextFileType = (file: File): boolean => {
  return isTextFile(file);
}; 