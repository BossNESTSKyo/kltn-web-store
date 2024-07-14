import { authMiddleware } from "@clerk/nextjs";
 
import createMiddleware from "next-intl/middleware";
 
const intlMiddleware = createMiddleware({
  locales: ["en", "vi"],
 
  defaultLocale: "en",
});
 
const publicRoutes = [
                      "/", "/vi", "/:locale/sign-in", 
                      "/cart", "/vi/cart",
                      "/product/(.*)", "/vi/product/(.*)", 
                      "/category/(.*)", "/vi/category/(.*)",
                      "/result", "/vi/result"
                      ];

export default authMiddleware({
  beforeAuth: (req) => {
    // Execute next-intl middleware before Clerk's auth middleware
    return intlMiddleware(req);
  },
 
  // Ensure that locale specific sign-in pages are public
  publicRoutes: publicRoutes,
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};