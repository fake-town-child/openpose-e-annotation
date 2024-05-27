import {
  Layer,
  NodeStructure,
  Nodes,
  TargetPosition,
  TargetStyle,
} from "@/shared/types";

export const humanBones: NodeStructure[] = [
  { start: "nose", end: "neck", color: "#000099" },
  { start: "nose", end: "eye.R", color: "#330099" },
  { start: "nose", end: "eye.L", color: "#990099" },
  { start: "neck", end: "shoulder.R", color: "#990000" },
  { start: "neck", end: "shoulder.L", color: "#993300" },
  { start: "shoulder.R", end: "lower_arm.R", color: "#996600" },
  { start: "lower_arm.R", end: "hand.R", color: "#999900" },
  { start: "shoulder.L", end: "lower_arm.L", color: "#669900" },
  { start: "lower_arm.L", end: "hand.L", color: "#339900" },
  { start: "neck", end: "upper_leg.R", color: "#009900" },
  { start: "upper_leg.R", end: "lower_leg.R", color: "#009933" },
  { start: "lower_leg.R", end: "foot.R", color: "#009966" },
  { start: "neck", end: "upper_leg.L", color: "#009999" },
  { start: "upper_leg.L", end: "lower_leg.L", color: "#006699" },
  { start: "lower_leg.L", end: "foot.L", color: "#003399" },
];

export const humanBoneStyles: TargetStyle[] = [
  { id: "nose", color: "#990000" },
  { id: "eye.R", color: "#AA00FF" },
  { id: "eye.L", color: "#FF00AA" },
  { id: "neck", color: "#FF5500" },
  { id: "shoulder.R", color: "#FFAA00" },
  { id: "lower_arm.R", color: "#FFFF00" },
  { id: "hand.R", color: "#AAFF00" },
  { id: "shoulder.L", color: "#55FF00" },
  { id: "lower_arm.L", color: "#00FF00" },
  { id: "hand.L", color: "#00FF55" },
  { id: "upper_leg.R", color: "#00FFAA" },
  { id: "lower_leg.R", color: "#00FFFF" },
  { id: "foot.R", color: "#00AAFF" },
  { id: "upper_leg.L", color: "#0055FF" },
  { id: "lower_leg.L", color: "#0000FF" },
  { id: "foot.L", color: "#5500FF" },
];

export const humanBonePositions: TargetPosition[] = [
  { id: "nose", x: 366.90820518231374, y: 127.8512909755458 },
  { id: "neck", x: 436.5364326211785, y: 318.3679866460696 },
  { id: "eye.R", x: 276.5781342448584, y: 91.41829276424066 },
  { id: "eye.L", x: 442.2879964196603, y: 74.92714025908587 },
  { id: "shoulder.R", x: 546.8808964015277, y: 300.8611594508731 },
  { id: "shoulder.L", x: 291.377855121397, y: 282.2936321338425 },
  { id: "lower_arm.R", x: 708.2860603037107, y: 372.81032780436635 },
  { id: "hand.R", x: 783.8164103646277, y: 525.9924281698684 },
  { id: "lower_arm.L", x: 190.31715499956292, y: 419.22914609694266 },
  { id: "hand.L", x: 134.61457304847136, y: 519.0296054259819 },
  { id: "upper_leg.R", x: 550.2625374379903, y: 628.3133690844971 },
  { id: "lower_leg.R", x: 589.7185329866801, y: 747.9415965233616 },
  { id: "foot.R", x: 527.0531282917021, y: 883.8164103646279 },
  { id: "upper_leg.L", x: 434.2154917065495, y: 616.708664511353 },
  { id: "lower_leg.L", x: 427.2526689626632, y: 754.9044192672479 },
  { id: "foot.L", x: 336.73597329213936, y: 867.5698239622261 },
];

export const humanNodes: Nodes = {
  nodes: humanBones,
  targetStyle: humanBoneStyles,
  targetPosition: humanBonePositions,
};

export const wingBones: NodeStructure[] = [
  { start: "upper_wing.R", end: "lower_wing.R", color: "#660033" },
  { start: "lower_wing.R", end: "wing_tip.R", color: "#660066" },
  { start: "upper_wing.L", end: "lower_wing.L", color: "#663333" },
  { start: "lower_wing.L", end: "wing_tip.L", color: "#663366" },
];

export const wingBoneStyles: TargetStyle[] = [
  { id: "upper_wing.R", color: "#0000AA" },
  { id: "lower_wing.R", color: "#AA00AA" },
  { id: "wing_tip.R", color: "#AAAAAA" },
  { id: "upper_wing.L", color: "#0000DD" },
  { id: "lower_wing.L", color: "#AA00DD" },
  { id: "wing_tip.L", color: "#AADDDD" },
];

export const wingBonePositions: TargetPosition[] = [
  { id: "upper_wing.R", x: 718.1591770848572, y: 213.25348806557608 },
  { id: "lower_wing.R", x: 575.6593665904211, y: 166.8479595508545 },
  { id: "wing_tip.R", x: 483.19635301106047, y: 247.07068423477963 },
  { id: "upper_wing.L", x: 111.69884639373669, y: 208.54025506122994 },
  { id: "lower_wing.L", x: 272.767392838366, y: 190.66477610889854 },
  { id: "wing_tip.L", x: 363.0055042936804, y: 245.10235275592606 },
];

export const wingNodes: Nodes = {
  nodes: wingBones,
  targetStyle: wingBoneStyles,
  targetPosition: wingBonePositions,
};

export const defaultLayers: Layer[] = [
  {
    name: "humanAnnotation",
    type: "annotation",
    nodes: humanNodes,
    ref: null,
  },
  {
    name: "wingAnnotation",
    type: "annotation",
    nodes: wingNodes,
    ref: null,
  },
];

export const annotationLayerNames = defaultLayers.map((layer) => layer.name);
