import i18ns from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import cn from "./locales/cn.json";
import en from "./locales/en.json";
import id from "./locales/id.json";
import ja from "./locales/ja.json";
import vi from "./locales/vi.json";



i18ns.use(LanguageDetector).use(initReactI18next).init(
    {
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
        resources: {
            vi: { translation: vi },
            cnh: { translation: cn },
            en: { translation: en },
            id: { translation: id },
            jp: { translation: ja }
        },
        debug: false
    }
)
export default i18ns;
