import type { MandatoryHeadings, OptionalHeadings } from "./headings";

export type HeadingConfig = {
  [Property in MandatoryHeadings]: string;
} & {
  [Property in OptionalHeadings]+?: string;
};
