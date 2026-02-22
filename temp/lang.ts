export async function fetchLocaleFromApi(
  lang: string
): Promise<Record<string, unknown> | null> {
  try {
    const query = new URLSearchParams({
      locale: lang,
      key: process.env.NEXT_PUBLIC_LOCALE_KEY ?? "frontend_locale_labels_test",
    }).toString();
    const url = buildUrl(ConfigurationUrls.LOCALE, query);
    const res = await fetch(url);
    const json = (await res.json()) as LocaleApiResponse;
    if (json?.statusCode === "SUCCESS" && json?.result?.data) {
      return json.result.data as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}


