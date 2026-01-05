import { AminoAcid, Protein } from "./types";

export const AMINO_ACIDS: Record<string, AminoAcid> = {
  A: { code: "A", name: "Alanine", type: "hydrophobic", note: "Small, helix-friendly" },
  R: { code: "R", name: "Arginine", type: "positive", note: "Strongly basic; binds phosphates" },
  N: { code: "N", name: "Asparagine", type: "polar", note: "H-bonding; turns" },
  D: { code: "D", name: "Aspartate", type: "negative", note: "Acidic; salt bridges" },
  C: { code: "C", name: "Cysteine", type: "special", note: "Disulfides; redox" },
  Q: { code: "Q", name: "Glutamine", type: "polar", note: "H-bonding; flexible" },
  E: { code: "E", name: "Glutamate", type: "negative", note: "Acidic; helix capper" },
  G: { code: "G", name: "Glycine", type: "special", note: "Very flexible; tight turns" },
  H: { code: "H", name: "Histidine", type: "positive", note: "pH-sensitive; catalysis" },
  I: { code: "I", name: "Isoleucine", type: "hydrophobic", note: "Bulky hydrophobe" },
  L: { code: "L", name: "Leucine", type: "hydrophobic", note: "Helix, coiled-coils" },
  K: { code: "K", name: "Lysine", type: "positive", note: "Basic; surface" },
  M: { code: "M", name: "Methionine", type: "hydrophobic", note: "Start; thioether" },
  F: { code: "F", name: "Phenylalanine", type: "hydrophobic", note: "Aromatic core packing" },
  P: { code: "P", name: "Proline", type: "special", note: "Helix breaker; kinks" },
  S: { code: "S", name: "Serine", type: "polar", note: "Phosphorylation; H-bonds" },
  T: { code: "T", name: "Threonine", type: "polar", note: "Phosphorylation; beta sheets" },
  W: { code: "W", name: "Tryptophan", type: "hydrophobic", note: "Large aromatic; binding" },
  Y: { code: "Y", name: "Tyrosine", type: "polar", note: "Aromatic; phosphorylation" },
  V: { code: "V", name: "Valine", type: "hydrophobic", note: "Beta sheets; core" }
};

export const TYPE_COLOR: Record<string, string> = {
  hydrophobic: "#60a5fa",
  polar: "#34d399",
  positive: "#fbbf24",
  negative: "#fb7185",
  special: "#a78bfa"
};

export const SAMPLE_DATASET: Protein[] = [
  {
    id: "1",
    name: "Hemoglobin beta chain",
    organism: "Homo sapiens",
    length: 147,
    sequence: "MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSSPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH",
    tags: ["oxygen transport", "globin", "classic"]
  },
  {
    id: "2",
    name: "Ubiquitin",
    organism: "Homo sapiens",
    length: 76,
    sequence: "MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG",
    tags: ["protein degradation", "ubiquitin", "small"]
  },
  {
    id: "3",
    name: "Lysozyme C",
    organism: "Gallus gallus",
    length: 129,
    sequence: "KVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL",
    tags: ["antimicrobial", "enzyme", "secreted"]
  }
];
