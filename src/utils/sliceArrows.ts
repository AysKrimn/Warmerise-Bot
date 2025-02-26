const sliceArrows = (text: string) => {
  return text.replace(/[→↑↓←]/g, "");
};

export default sliceArrows;
