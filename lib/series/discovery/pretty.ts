export const LANGUAGE_OPTIONS = [
    { value: "ENGLISH", label: "English" },
    { value: "CHINESE", label: "Chinese" },
    { value: "JAPANESE", label: "Japanese" },
    { value: "KOREAN", label: "Korean" },
    { value: "HINDI", label: "Hindi" },
    { value: "UNKNOWN", label: "Unknown" },
] as const;

export const STATUS_OPTIONS = [
    { value: "ONGOING", label: "Ongoing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "HIATUS", label: "On hiatus" },
    { value: "DISCONTINUED", label: "Discontinued" },
    { value: "NOT_STARTED", label: "Not started" },
    { value: "NOT_APPLICABLE", label: "Not applicable" },
    { value: "UNKNOWN", label: "Unknown" },
] as const;

export const SORT_OPTIONS = [
    { value: "recent", label: "Recently published" },
    { value: "updated", label: "Recently updated" },
    { value: "title-asc", label: "Title: A–Z" },
    { value: "title-desc", label: "Title: Z–A" },
    { value: "oldest", label: "Oldest first" },
] as const;
