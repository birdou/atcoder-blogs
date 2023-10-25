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

export const ThemeLight = {
    difficultyBlackColor: "#404040",
    difficultyGreyColor: "#808080",
    difficultyBrownColor: "#804000",
    difficultyGreenColor: "#008000",
    difficultyCyanColor: "#00C0C0",
    difficultyBlueColor: "#0000FF",
    difficultyYellowColor: "#C0C000",
    difficultyOrangeColor: "#FF8000",
    difficultyRedColor: "#FF0000",
  };
  
  export const ThemeDark: typeof ThemeLight = {
    ...ThemeLight,
    difficultyBlackColor: "#FFFFFF",
    difficultyGreyColor: "#C0C0C0",
    difficultyBrownColor: "#B08C56",
    difficultyGreenColor: "#3FAF3F",
    difficultyCyanColor: "#42E0E0",
    difficultyBlueColor: "#8888FF",
    difficultyYellowColor: "#FFFF56",
    difficultyOrangeColor: "#FFB836",
    difficultyRedColor: "#FF6767",
  };
  
  export const ThemePurple = ThemeLight;
  
  export type Theme = typeof ThemeLight;