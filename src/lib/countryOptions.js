import countries from "i18n-iso-countries";
import esLocale from "i18n-iso-countries/langs/es.json";

let registered = false;

export function getCountryOptionsES() {
    if (!registered) {
        countries.registerLocale(esLocale);
        registered = true;
    }
    const obj = countries.getNames("es", { select: "official" });
    return Object.entries(obj)
        .map(([code, name]) => ({ code, name })) // { code: "AR", name: "Argentina" }
        .sort((a, b) => a.name.localeCompare(b.name));
}
