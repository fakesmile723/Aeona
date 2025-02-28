export const calculateAmountOfTrue = (array: boolean[]) => {
  // get the amount of true values before endIndex, stopping at the first false value
  for (let i = array.length - 1; i >= 0; i--) {
    if (!array[i]) {
      return array.length - i;
    }
  }

  return array.length - 1;
};

export function calculateInlineIndex(fields: EmbedField[], currentFieldIndex: number) {
  // get the amount of inline fields before the current field without gaps
  const inlineFieldsBefore = fields.slice(0, currentFieldIndex).map((e) => e.inline ?? false);

  const amount = calculateAmountOfTrue(inlineFieldsBefore) + 1;

  return (amount % 3) + 1;
}

type EmbedField = {
  inline?: boolean;
  name: string;
  value: string;
};
