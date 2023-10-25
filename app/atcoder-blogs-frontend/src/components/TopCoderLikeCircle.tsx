/*
MIT License

Copyright (c) 2019 kenkoooo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from "react";
import { Theme } from "../style/Theme";
import { getRatingColorCode, RatingColor, getRatingColor } from "../utils/index";
import { useTheme } from "./ThemeProvider";

type RatingMetalColor = "Bronze" | "Silver" | "Gold";
const getRatingMetalColorCode = (metalColor: RatingMetalColor) => {
  switch (metalColor) {
    case "Bronze":
      return { base: "#965C2C", highlight: "#FFDABD" };
    case "Silver":
      return { base: "#808080", highlight: "white" };
    case "Gold":
      return { base: "#FFD700", highlight: "white" };
  }
};

function getColor(difficulty: number) {
  if (difficulty < 3200) {
    return getRatingColor(difficulty);
  } else if (difficulty < 3600) {
    return "Bronze";
  } else if (difficulty < 4000) {
    return "Silver";
  } else {
    return "Gold";
  }
}

type RatingColorWithMetal = RatingColor | RatingMetalColor;
const getStyleOptions = (
  color: RatingColorWithMetal,
  fillRatio: number,
  theme: Theme
) => {
  if (color === "Bronze" || color === "Silver" || color === "Gold") {
    const metalColor = getRatingMetalColorCode(color);
    return {
      borderColor: metalColor.base,
      background: `linear-gradient(to right, \
        ${metalColor.base}, ${metalColor.highlight}, ${metalColor.base})`,
    };
  } else {
    const colorCode = getRatingColorCode(color, theme);
    return {
      borderColor: colorCode,
      background: `border-box linear-gradient(to top, \
        ${colorCode} ${fillRatio * 100}%, \
        rgba(0,0,0,0) ${fillRatio * 100}%)`,
    };
  }
};

interface Props {
  rating: number;
  big? : boolean;
}

export const TopcoderLikeCircle: React.FC<Props> = (props) => {
  const { rating } = props;
  const color = getColor(rating);
  const fillRatio = rating >= 3200 ? 1.0 : (rating % 400) / 400;
  const className = `topcoder-like-circle \
    ${props.big ? "topcoder-like-circle-big" : ""}`;
  const theme = useTheme();
  const styleOptions = getStyleOptions(color, fillRatio, theme);
  return (
    <span
      className={`${className}`}
      style={styleOptions}
    />
  );
};