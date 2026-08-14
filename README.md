# Gemini AI Chat — GitHub Pages

مشروع ثابت يعمل من GitHub Pages مباشرة، بدون Vercel أو Backend.

## التشغيل

1. أنشئ Repository جديد على GitHub.
2. ارفع:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
3. فعّل GitHub Pages من Settings → Pages.
4. افتح رابط الموقع.
5. ضع Gemini API Key داخل خانة `Gemini API Key`.
6. اضغط «حفظ».
7. ابدأ المحادثة.

## ملاحظة أمنية

هذا المشروع يرسل الطلب من المتصفح مباشرة إلى Gemini API، لذلك لا يحتاج `api-ai.js` أو `api.js`.

المفتاح يُحفظ في `localStorage` على الجهاز، وليس داخل ملفات GitHub. مع ذلك، أي مستخدم يضع مفتاحه في الموقع يستطيع المتصفح استخدامه. لا تضع مفتاحًا شخصيًا في كود عام إذا كنت تريد حمايته.

إذا ظهر خطأ 400/403/429، راجع صلاحية المفتاح، النموذج، والـ quota في Google AI Studio.
