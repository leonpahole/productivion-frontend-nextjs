export const pluralize = (count: number, str: string, appendix = "s") => {
  if (count !== 1) {
    return str + appendix;
  }

  return str;
};
