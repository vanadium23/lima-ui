import { defineMiddleware } from "astro:middleware";

import { REDIRECT_TO_PARAM, URL_AUTH } from "../utilities/addresses.ts";

// DOC: Переименовывать или перемещать этот файл запрещено, имя зарезервировано Astro и подхватывается им автоматически!
// DOC: Используется для закрытия приватных страниц без авторизации. А также для перехвата других запросов на сервер.

// DOC: Маршруты, требующие авторизации (проверяется по префиксу)
const PROTECTED_PREFIXES = ["/lists", "/account"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// DOC: Имя зарезервировано Astro, переименовывать запрещено. Подхватывается Astro автоматически.
// DOC: Поэтому мы имеем здесь ложное срабатывание, что переменная не используется.
export const onRequest = defineMiddleware(({ cookies, url }, next) => {
  if (!isProtectedRoute(url.pathname)) {
    return next();
  }

  const token = cookies.get("token")?.value;

  if (token) {
    return next();
  }

  // DOC: Сохраняем исходный путь (с query-параметрами) для редиректа после авторизации
  const redirectTarget = url.pathname + url.search;
  const authUrl = new URL(URL_AUTH, url.origin);

  authUrl.searchParams.set(REDIRECT_TO_PARAM, redirectTarget);

  return Response.redirect(authUrl.toString(), 302);
});
