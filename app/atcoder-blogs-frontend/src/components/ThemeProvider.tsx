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
import { Helmet } from "react-helmet";
//import { useLocalStorage } from "../utils/LocalStorage";
import { ThemeLight, ThemeDark, ThemePurple, Theme } from "../style/Theme";

type RenderedThemeId = "light" | "dark" | "purple";
type ThemeId = RenderedThemeId | "auto";
type ThemeContextProps = [ThemeId, (newThemeId: ThemeId) => void];

const THEME_LIST = {
  light: ThemeLight,
  dark: ThemeDark,
  purple: ThemePurple,
};

export const ThemeContext = React.createContext<ThemeContextProps>([
  "light",
  (): void => {
    throw new Error("setThemeId is not implemented.");
  },
]);

interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (
  props: ThemeProviderProps
) => {
  //const [themeId, setThemeId] = useLocalStorage<ThemeId>("theme", "light");
  const setThemeId = (newThemeId: ThemeId) => {};
  const themeId = "auto";
  const helmet =
    themeId == "auto" ? (
      <AutoThemeHelmet />
    ) : (
      <Helmet>
        <html className={`theme-${themeId}`} />
      </Helmet>
    );

  return (
    <ThemeContext.Provider value={[themeId, setThemeId]}>
      {helmet}

      {props.children}
    </ThemeContext.Provider>
  );
};

function AutoThemeHelmet() {
  const [renderedThemeId, setRenderedThemeId] = React.useState<RenderedThemeId>(
    findRenderedThemeIdOfAuto()
  );

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e: MediaQueryListEvent) =>
      setRenderedThemeId(e.matches ? "dark" : "light")
    );

  return (
    <Helmet>
      <html className={`theme-${renderedThemeId}`} />
    </Helmet>
  );
}

export const useTheme = (): Theme => {
  const [themeId] = React.useContext(ThemeContext);
  return THEME_LIST[findRenderedThemeIdOf(themeId)];
};

const findRenderedThemeIdOf = (themeId: ThemeId): RenderedThemeId =>
  themeId == "auto" ? findRenderedThemeIdOfAuto() : themeId;

const findRenderedThemeIdOfAuto = (): RenderedThemeId =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";