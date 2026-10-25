import {
    createLoader,
    createParser,
    createSerializer,
    inferParserType,
    parseAsNativeArrayOf,
    parseAsString,
    parseAsStringLiteral,
    UrlKeys,
} from "nuqs/server";

import { LANGUAGE_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "./pretty";

const pageParser = createParser({
    parse(value: string) {
        const page = Number(value);

        return Number.isSafeInteger(page) && page >= 1 && page <= 1000
            ? page
            : null;
    },
    serialize: String,
}).withDefault(1);

export const discoveryParsers = {
    page: pageParser,

    q: parseAsString.withDefault(""),
    author: parseAsString.withDefault(""),
    translator: parseAsString.withDefault(""),

    genres: parseAsNativeArrayOf(parseAsString),
    tags: parseAsNativeArrayOf(parseAsString),

    language: parseAsStringLiteral(
        LANGUAGE_OPTIONS.map((option) => option.value),
    ),
    originalLanguage: parseAsStringLiteral(
        LANGUAGE_OPTIONS.map((option) => option.value),
    ),

    originalStatus: parseAsStringLiteral(
        STATUS_OPTIONS.map((option) => option.value),
    ),
    translationStatus: parseAsStringLiteral(
        STATUS_OPTIONS.map((option) => option.value),
    ),

    sort: parseAsStringLiteral(
        SORT_OPTIONS.map((option) => option.value),
    ).withDefault("recent"),
};

export const discoveryUrlKeys = {
    genres: "genre",
    tags: "tag",
} satisfies UrlKeys<typeof discoveryParsers>;

export const loadDiscoveryParams = createLoader(discoveryParsers, {
    urlKeys: discoveryUrlKeys,
});

export const serializeDiscoveryParams = createSerializer(discoveryParsers, {
    urlKeys: discoveryUrlKeys,
});

export type DiscoveryFilters = inferParserType<typeof discoveryParsers>;
