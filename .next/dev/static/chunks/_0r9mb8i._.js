(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-white text-slate-950", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_c2 = CardTitle;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
_c3 = CardContent;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectItem",
    ()=>SelectItem,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-60"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 25,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 24,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-950 shadow-md", className),
            position: position,
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                className: "p-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 36,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 35,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 64,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 63,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 68,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 55,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c3, "SelectContent");
__turbopack_context__.k.register(_c4, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Button({ className, variant = "default", type = "button", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", variant === "default" ? "bg-slate-900 text-white hover:bg-slate-800" : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type = "text", ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FormationRecognitionWorkingApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock-3.js [app-client] (ecmascript) <export default as Clock3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shuffle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shuffle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shuffle.js [app-client] (ecmascript) <export default as Shuffle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const MODE_OPTIONS = [
    {
        value: "study",
        label: "Formation Trainer",
        title: "FORMATION TRAINER"
    },
    {
        value: "alignment",
        label: "Alignment Mode",
        title: "DEFENSIVE ALIGNMENT"
    },
    {
        value: "offense_build",
        label: "Offensive Mode",
        title: "OFFENSIVE FORMATION"
    },
    {
        value: "quiz",
        label: "Quiz Mode",
        title: "QUIZ MODE"
    },
    {
        value: "editor",
        label: "Formation Editor",
        title: "FORMATION EDITOR"
    },
    {
        value: "account",
        label: "Account / Leaderboard",
        title: "ACCOUNT / LEADERBOARD"
    }
];
const PLAYBOOK_OPTIONS = [
    "Foothill",
    "Pro",
    "Wing T"
];
const PERSONNEL_OPTIONS = [
    "Any",
    "11",
    "12",
    "21"
];
const ALIGNMENT_BASE_CALLS = [
    "Doubles",
    "Trips",
    "Trey",
    "Troop",
    "Bunch",
    "B Trips",
    "B Trey",
    "B Doubles",
    "Quad",
    "Dog"
];
const ALIGNMENT_EMPTY_BASE_CALLS = [
    "Doubles",
    "Trips",
    "Trey",
    "Troop",
    "Bunch"
];
const CUSTOM_ALIGNMENT_LAYERS = [
    "dl",
    "lb",
    "cb",
    "db"
];
const ALIGNMENT_CALLS = [
    ...ALIGNMENT_BASE_CALLS.flatMap((base)=>[
            `${base} Left`,
            `${base} Right`,
            `${base} Left King`,
            `${base} Right King`,
            `${base} Left Queen`,
            `${base} Right Queen`
        ]),
    ...ALIGNMENT_EMPTY_BASE_CALLS.flatMap((base)=>[
            `${base} Empty Left`,
            `${base} Empty Right`
        ])
];
const WING_T_CALLS = [
    "Wing T Far Right",
    "Wing T Far Left",
    "Wing T Near Right",
    "Wing T Near Left",
    "Wing T Unbalanced Far Right",
    "Wing T Unbalanced Far Left",
    "Wing T Unbalanced Near Right",
    "Wing T Unbalanced Near Left"
];
const PRO_CALLS = [
    "I Dot Right",
    "I Dot Left",
    "I Far Right",
    "I Far Left",
    "I Near Right",
    "I Near Left",
    "I Slot Right",
    "I Slot Left",
    "I Slot Far Right",
    "I Slot Far Left",
    "I Slot Near Right",
    "I Slot Near Left",
    "Ace Right",
    "Ace Left",
    "Ace Trey Right",
    "Ace Trey Left",
    "Flank Right",
    "Flank Left"
];
const DEFENDER_TOKENS = [
    "N",
    "T",
    "SDE",
    "WDE",
    "M",
    "W",
    "Ni",
    "FC",
    "BC",
    "FS",
    "BS"
];
const OFFENSE_TOKENS = [
    "QB",
    "RB",
    "X",
    "Y",
    "H",
    "Z"
];
const FIXED_OL_IDS = [
    "LT",
    "LG",
    "C",
    "RG",
    "RT"
];
const TIGHT_OLINE_X = [
    40,
    45,
    50,
    55,
    60
];
const ALIGNMENT_OLINE_X = [
    38,
    44,
    50,
    56,
    62
];
const LOS_Y = 52;
const OFF_Y = 44;
const WING_Y = LOS_Y - (LOS_Y - OFF_Y) * 0.75;
const QB_UNDER_Y = 42;
const QB_GUN_Y = 24;
const RB_DOT_Y = 24;
const LB_Y = 66;
const CB_Y = 76;
const DB_Y = 86;
const DL_Y = 58;
const FIELD_LABELS = {
    left: "Left",
    right: "Right"
};
const DEFAULT_MODE_STATS = {
    points: 0,
    attempts: 0,
    correct: 0,
    bestTimeMs: null
};
const DEFAULT_STATS = {
    totalPoints: 0,
    secondsUsed: 0,
    quiz: {
        ...DEFAULT_MODE_STATS
    },
    offense_build: {
        ...DEFAULT_MODE_STATS
    },
    alignment: {
        ...DEFAULT_MODE_STATS
    }
};
const USER_STORAGE_KEY = "formation-recognition-user";
const LEADERBOARD_STORAGE_KEY = "formation-recognition-leaderboard";
function normalize(value) {
    return value.trim().toLowerCase();
}
function normalizeStrength(value) {
    const v = normalize(value);
    if (v === "l") return "left";
    if (v === "r") return "right";
    return v;
}
function getQuizFormationFamily(name) {
    const isEmpty = name.includes("Empty");
    const base = name.split(" ").filter((part)=>![
            "Left",
            "Right",
            "King",
            "Queen",
            "Empty"
        ].includes(part)).join(" ").trim();
    return isEmpty ? `${base} Empty` : base;
}
function getModeTitle(mode) {
    return MODE_OPTIONS.find((m)=>m.value === mode)?.title ?? "FORMATION TRAINER";
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function getLineXs(wide = false) {
    return wide ? ALIGNMENT_OLINE_X : TIGHT_OLINE_X;
}
function baseLine(wide = false) {
    const xs = getLineXs(wide);
    return [
        {
            id: "LT",
            x: xs[0],
            y: LOS_Y
        },
        {
            id: "LG",
            x: xs[1],
            y: LOS_Y
        },
        {
            id: "C",
            x: xs[2],
            y: LOS_Y
        },
        {
            id: "RG",
            x: xs[3],
            y: LOS_Y
        },
        {
            id: "RT",
            x: xs[4],
            y: LOS_Y
        }
    ];
}
function getWide(side) {
    return side === "right" ? 92 : 8;
}
function getAttached(side, wide = false) {
    const xs = getLineXs(wide);
    const attachSpacing = wide ? xs[1] - xs[0] : 4;
    return side === "right" ? xs[4] + attachSpacing : xs[0] - attachSpacing;
}
function getFlexTe(side, wide = false) {
    return getAttached(side, wide) + (side === "right" ? 6 : -6);
}
function getWing(side, wide = false) {
    const xs = getLineXs(wide);
    const olSpacing = xs[1] - xs[0];
    return getAttached(side, wide) + (side === "right" ? olSpacing * 0.25 : -olSpacing * 0.25);
}
function getBunchMiddle(side, wide = false) {
    return getAttached(side, wide) + (side === "right" ? 3 : -3);
}
function getBunchOutside(side, wide = false) {
    return getAttached(side, wide) + (side === "right" ? 6 : -6);
}
function getSlot(side, wide = false) {
    return (getAttached(side, wide) + getWide(side)) / 2;
}
function getMidpoint(a, b) {
    return (a + b) / 2;
}
function isBackfieldEligible(p) {
    return p.y < OFF_Y - 2;
}
function isEligibleSkillPlayer(p) {
    return ![
        ...FIXED_OL_IDS,
        "QB"
    ].includes(p.id) && !isBackfieldEligible(p);
}
function isSplitOutWideEligible(p) {
    return isEligibleSkillPlayer(p);
}
function countsAsNonBackfieldEligible(p) {
    return isEligibleSkillPlayer(p);
}
function isWingLikePlayer(p) {
    return Math.abs(p.y - WING_Y) < 1.0;
}
function isTrueWideReceiver(p) {
    if (![
        "X",
        "Z",
        "H"
    ].includes(p.id)) return false;
    if (isWingLikePlayer(p)) return false;
    return !isBackfieldEligible(p);
}
function getPassCatcherPriorityScore(p) {
    if ([
        "Y",
        "U"
    ].includes(p.id)) return 1;
    if (p.id === "RB" || p.id === "F") return 0;
    if (isWingLikePlayer(p)) return 2;
    if ([
        "X",
        "Z",
        "H"
    ].includes(p.id)) return 3;
    return 0;
}
function getOffsetBackSide(players) {
    const back = players.find((p)=>[
            "RB",
            "F"
        ].includes(p.id) && p.x !== 50);
    if (!back) return null;
    return back.x < 50 ? "left" : "right";
}
function computePassStrengthFromEligibles(players, callSide, opts) {
    const isEmpty = opts?.isEmpty ?? false;
    const isPistol = opts?.isPistol ?? false;
    const personnel = opts?.personnel ?? "11";
    const trueEligibles = players.filter((p)=>{
        if ([
            "LT",
            "LG",
            "C",
            "RG",
            "RT",
            "QB"
        ].includes(p.id)) return false;
        return !isBackfieldEligible(p);
    });
    const left = trueEligibles.filter((p)=>p.x < 50);
    const right = trueEligibles.filter((p)=>p.x > 50);
    if (left.length > right.length) return "left";
    if (right.length > left.length) return "right";
    const leftTrueWr = left.filter(isTrueWideReceiver).length;
    const rightTrueWr = right.filter(isTrueWideReceiver).length;
    if (leftTrueWr > rightTrueWr) return "left";
    if (rightTrueWr > leftTrueWr) return "right";
    const leftPassPriority = left.reduce((sum, p)=>sum + getPassCatcherPriorityScore(p), 0);
    const rightPassPriority = right.reduce((sum, p)=>sum + getPassCatcherPriorityScore(p), 0);
    if (leftPassPriority > rightPassPriority) return "left";
    if (rightPassPriority > leftPassPriority) return "right";
    const isTwoByTwo = left.length === 2 && right.length === 2;
    if (isTwoByTwo) {
        const is10p = personnel === "10" || !trueEligibles.some((p)=>[
                "Y",
                "U"
            ].includes(p.id));
        if (is10p) {
            if (isPistol) return "left";
            const offsetSide = getOffsetBackSide(players);
            if (offsetSide) return offsetSide;
            return "left";
        }
    }
    return callSide;
}
function dedupeLandmarks(points) {
    const out = [];
    points.forEach((point)=>{
        const exists = out.some((p)=>p.layer === point.layer && p.label === point.label && Math.abs(p.x - point.x) < 0.2 && Math.abs(p.y - point.y) < 0.2);
        if (!exists) out.push(point);
    });
    return out;
}
function buildFoothillFormation(call, wide = false) {
    const side = call.includes("Left") ? "left" : "right";
    const other = side === "right" ? "left" : "right";
    const isEmpty = call.includes("Empty");
    const isKing = call.includes("King");
    const isQueen = call.includes("Queen");
    const isGun = !isEmpty && (isKing || isQueen);
    const base = call.startsWith("B ") ? `${call.split(" ")[0]} ${call.split(" ")[1]}` : call.split(" ")[0];
    const players = [
        ...baseLine(wide),
        {
            id: "QB",
            x: 50,
            y: isGun || isEmpty ? QB_GUN_Y : QB_UNDER_Y
        }
    ];
    const add = (id, x, y)=>players.push({
            id,
            x,
            y
        });
    if (!isEmpty) {
        add("RB", isGun ? isKing ? 58 : isQueen ? 42 : 50 : 50, isGun ? QB_GUN_Y : RB_DOT_Y);
    }
    switch(base){
        case "Trips":
            add("Y", getAttached(side, wide), LOS_Y);
            add("H", getWing(side, wide), WING_Y);
            add("Z", getWide(side), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        case "Trey":
            add("Y", getAttached(side, wide), LOS_Y);
            add("H", getSlot(side, wide), OFF_Y);
            add("Z", getWide(side), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        case "Troop":
            {
                const yX = getFlexTe(side, wide);
                const zX = wide ? side === "right" ? 96 : 4 : getWide(side);
                const hX = getMidpoint(yX, zX);
                add("Y", yX, LOS_Y);
                add("H", hX, OFF_Y);
                add("Z", zX, OFF_Y);
                add("X", getWide(other), LOS_Y);
                break;
            }
        case "Bunch":
            if (isEmpty) {
                add("H", getAttached(side, wide), OFF_Y);
                add("Y", getBunchMiddle(side, wide), LOS_Y);
                add("Z", getBunchOutside(side, wide), OFF_Y);
                add("X", getWide(other), LOS_Y);
                add("RB", getSlot(other, wide), OFF_Y);
            } else {
                add("H", getAttached(side, wide), OFF_Y);
                add("Y", getBunchMiddle(side, wide), LOS_Y);
                add("Z", getBunchOutside(side, wide), OFF_Y);
                add("X", getWide(other), LOS_Y);
            }
            break;
        case "Doubles":
            // Y/Z stay on the called side. X/H are opposite the called side, which becomes strong pass.
            add("Y", getAttached(side, wide), LOS_Y);
            add("Z", getWide(side), OFF_Y);
            add("H", getSlot(other, wide), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        case "Dog":
            {
                // H is opposite the called side in a true wing alignment so wing-surface detection can identify it cleanly.
                const hX = getWing(other, wide);
                add("Y", getAttached(side, wide), LOS_Y);
                add("Z", getWide(side), OFF_Y);
                add("H", hX, WING_Y);
                add("X", getWide(other), LOS_Y);
                break;
            }
        case "B Trips":
            add("Y", getAttached(side, wide), LOS_Y);
            add("H", getWing(other, wide), WING_Y);
            add("Z", getSlot(other, wide), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        case "B Trey":
            add("Y", getAttached(side, wide), LOS_Y);
            add("Z", getFlexTe(other, wide), OFF_Y);
            add("H", getMidpoint(getFlexTe(other, wide), getWide(other)), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        case "B Doubles":
            add("Y", getAttached(side, wide), LOS_Y);
            add("H", getWing(side, wide), WING_Y);
            add("Z", getSlot(other, wide), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        case "Quad":
            add("Y", getSlot(side, wide), LOS_Y);
            add("Z", getWide(side), OFF_Y);
            add("H", getSlot(other, wide), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
        default:
            add("Y", getAttached(side, wide), LOS_Y);
            add("H", getSlot(side, wide), OFF_Y);
            add("Z", getWide(side), OFF_Y);
            add("X", getWide(other), LOS_Y);
            break;
    }
    if (isEmpty && base !== "Bunch") {
        const emptySide = base === "Doubles" ? side : other;
        const slotOccupied = players.some((p)=>p.id !== "QB" && p.id !== "RB" && Math.abs(p.y - OFF_Y) < 0.2 && (emptySide === "left" ? p.x < 50 : p.x > 50) && Math.abs(p.x - getSlot(emptySide, wide)) < 8);
        add("RB", slotOccupied ? getWing(emptySide, wide) : getSlot(emptySide, wide), OFF_Y);
    }
    const passStrength = computePassStrengthFromEligibles(players, side, {
        isEmpty,
        isPistol: false,
        personnel: isEmpty ? "10" : "11"
    });
    return {
        playbook: "Foothill",
        family: "Spread",
        name: call,
        personnel: "11",
        runStrength: side,
        passStrength,
        backfield: isEmpty ? "Empty" : isGun ? "Gun" : "Under Center",
        players
    };
}
function buildWingTFormation(call, wide = false) {
    const side = call.includes("Left") ? "left" : "right";
    const other = side === "right" ? "left" : "right";
    const isUnbalanced = call.includes("Unbalanced");
    const isFar = call.includes("Far");
    const isNear = call.includes("Near");
    const players = [
        ...baseLine(wide),
        {
            id: "QB",
            x: 50,
            y: QB_UNDER_Y
        }
    ];
    const add = (id, x, y)=>players.push({
            id,
            x,
            y
        });
    const xs = getLineXs(wide);
    add("RB", 50, RB_DOT_Y);
    const fbX = isFar ? side === "right" ? xs[0] : xs[4] : isNear ? side === "right" ? xs[4] : xs[0] : 50;
    add("F", fbX, RB_DOT_Y);
    add("Y", getAttached(side, wide), LOS_Y);
    add("Z", getWing(side, wide), WING_Y);
    if (isUnbalanced) {
        add("X", getWide(side), LOS_Y);
    } else {
        add("X", getWide(other), LOS_Y);
    }
    const passStrength = computePassStrengthFromEligibles(players, side, {
        isEmpty: false,
        isPistol: false,
        personnel: "21"
    });
    return {
        playbook: "Wing T",
        family: "Wing T",
        name: call,
        personnel: "21",
        runStrength: side,
        passStrength,
        backfield: "Under Center",
        players
    };
}
function buildProFormation(call, wide = false) {
    const side = call.includes("Left") ? "left" : "right";
    const other = side === "right" ? "left" : "right";
    const isFar = call.includes("Far");
    const isNear = call.includes("Near");
    const isISlot = call.startsWith("I Slot");
    const isAce = call.startsWith("Ace") && !call.startsWith("Ace Trey");
    const isAceTrey = call.startsWith("Ace Trey");
    const isFlank = call.startsWith("Flank");
    const players = [
        ...baseLine(wide),
        {
            id: "QB",
            x: 50,
            y: QB_UNDER_Y
        }
    ];
    const add = (id, x, y)=>players.push({
            id,
            x,
            y
        });
    const fbY = getMidpoint(QB_UNDER_Y, RB_DOT_Y);
    const xs = getLineXs(wide);
    const fbX = isFar ? side === "right" ? xs[1] : xs[3] : isNear ? side === "right" ? xs[3] : xs[1] : 50;
    if (call.startsWith("I ")) {
        add("F", fbX, fbY);
        add("RB", 50, RB_DOT_Y);
    }
    if (call.startsWith("I Dot") || call.startsWith("I Far") || call.startsWith("I Near")) {
        add("Y", getAttached(side, wide), LOS_Y);
        add("Z", getWide(side), LOS_Y);
        add("X", getWide(other), LOS_Y);
    }
    if (isISlot) {
        add("Y", getAttached(side, wide), LOS_Y);
        add("X", getWide(other), LOS_Y);
        add("Z", getSlot(other, wide), OFF_Y);
    }
    if (isAce) {
        add("Y", getAttached(side, wide), LOS_Y);
        add("U", getAttached(other, wide), LOS_Y);
        add("Z", getWide(side), OFF_Y);
        add("X", getWide(other), OFF_Y);
        add("RB", 50, RB_DOT_Y);
    }
    if (isAceTrey) {
        add("Y", getAttached(side, wide), LOS_Y);
        add("U", getAttached(other, wide), LOS_Y);
        add("Z", getSlot(side, wide), OFF_Y);
        add("X", getWide(side), OFF_Y);
        add("RB", 50, RB_DOT_Y);
    }
    if (isFlank) {
        add("Y", getAttached(side, wide), LOS_Y);
        add("U", getWing(side, wide), WING_Y);
        add("Z", getSlot(other, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
        add("RB", 50, RB_DOT_Y);
    }
    const passStrength = computePassStrengthFromEligibles(players, side, {
        isEmpty: false,
        isPistol: false,
        personnel: call.startsWith("I ") ? "21" : "12"
    });
    return {
        playbook: "Pro",
        family: call.startsWith("I ") ? "I" : "12p",
        name: call,
        personnel: call.startsWith("I ") ? "21" : "12",
        runStrength: side,
        passStrength,
        backfield: "Under Center",
        players
    };
}
const ALL_FORMATIONS = [
    ...WING_T_CALLS.map((call)=>buildWingTFormation(call, false)),
    ...ALIGNMENT_CALLS.map((call)=>buildFoothillFormation(call, false)),
    ...PRO_CALLS.map((call)=>buildProFormation(call, false))
];
function getDefaultCustomLandmarkPosition(layer, side) {
    const yMap = {
        dl: DL_Y,
        lb: LB_Y,
        cb: CB_Y,
        db: DB_Y
    };
    return {
        x: side === "left" ? 25 : 75,
        y: yMap[layer]
    };
}
function getOffenseBuildLandmarks() {
    const leftAttached = getAttached("left", false);
    const rightAttached = getAttached("right", false);
    const leftSlot = getSlot("left", false);
    const rightSlot = getSlot("right", false);
    return dedupeLandmarks([
        {
            id: "o-qb-under",
            x: 50,
            y: QB_UNDER_Y,
            layer: "offense"
        },
        {
            id: "o-qb-gun",
            x: 50,
            y: QB_GUN_Y,
            layer: "offense"
        },
        {
            id: "o-rb-dot",
            x: 50,
            y: RB_DOT_Y,
            layer: "offense"
        },
        {
            id: "o-rb-left",
            x: 42,
            y: QB_GUN_Y,
            layer: "offense"
        },
        {
            id: "o-rb-right",
            x: 58,
            y: QB_GUN_Y,
            layer: "offense"
        },
        {
            id: "o-y-left",
            x: leftAttached,
            y: LOS_Y,
            layer: "offense"
        },
        {
            id: "o-y-right",
            x: rightAttached,
            y: LOS_Y,
            layer: "offense"
        },
        {
            id: "o-y-flex-left",
            x: getFlexTe("left", false),
            y: LOS_Y,
            layer: "offense"
        },
        {
            id: "o-y-flex-right",
            x: getFlexTe("right", false),
            y: LOS_Y,
            layer: "offense"
        },
        {
            id: "o-h-wing-left",
            x: getWing("left", false),
            y: WING_Y,
            layer: "offense"
        },
        {
            id: "o-h-wing-right",
            x: getWing("right", false),
            y: WING_Y,
            layer: "offense"
        },
        {
            id: "o-slot-left",
            x: leftSlot,
            y: OFF_Y,
            layer: "offense"
        },
        {
            id: "o-slot-right",
            x: rightSlot,
            y: OFF_Y,
            layer: "offense"
        },
        {
            id: "o-wide-left-on",
            x: 8,
            y: LOS_Y,
            layer: "offense"
        },
        {
            id: "o-wide-right-on",
            x: 92,
            y: LOS_Y,
            layer: "offense"
        },
        {
            id: "o-wide-left-off",
            x: 8,
            y: OFF_Y,
            layer: "offense"
        },
        {
            id: "o-wide-right-off",
            x: 92,
            y: OFF_Y,
            layer: "offense"
        }
    ]);
}
function getAlignmentLandmarks(formation) {
    const offense = formation.players;
    const skill = offense.filter((p)=>isEligibleSkillPlayer(p));
    const points = [];
    const push = (id, x, y, label, layer)=>points.push({
            id,
            x,
            y,
            label,
            layer
        });
    const xs = ALIGNMENT_OLINE_X;
    push("dl-left-5", xs[0] - 2.2, DL_Y, "5T", "dl");
    push("dl-left-4", xs[0], DL_Y, "4", "dl");
    push("dl-left-4i", xs[0] + 2.2, DL_Y, "4i", "dl");
    push("dl-right-4i", xs[4] - 2.2, DL_Y, "4i", "dl");
    push("dl-right-4", xs[4], DL_Y, "4", "dl");
    push("dl-right-5", xs[4] + 2.2, DL_Y, "5T", "dl");
    push("dl-left-3", xs[1] - 2.2, DL_Y, "3T", "dl");
    push("dl-left-2", xs[1], DL_Y, "2", "dl");
    push("dl-left-2i", xs[1] + 2.2, DL_Y, "2i", "dl");
    push("dl-right-2i", xs[3] - 2.2, DL_Y, "2i", "dl");
    push("dl-right-2", xs[3], DL_Y, "2", "dl");
    push("dl-right-3", xs[3] + 2.2, DL_Y, "3T", "dl");
    push("dl-0", xs[2], DL_Y, "0", "dl");
    push("dl-left-1", xs[2] - 2.2, DL_Y, "1T", "dl");
    push("dl-right-1", xs[2] + 2.2, DL_Y, "1T", "dl");
    const getFirstLevelSurface = (side)=>{
        const tackleX = side === "left" ? xs[0] : xs[4];
        const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
        const wingX = side === "left" ? attachedX - (xs[1] - xs[0]) * 0.25 : attachedX + (xs[1] - xs[0]) * 0.25;
        const sideSkill = skill.filter((p)=>side === "left" ? p.x < 50 : p.x > 50);
        const inline = sideSkill.filter((p)=>Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - attachedX) <= 3.5 && Math.abs(p.x - tackleX) <= 8).sort((a, b)=>Math.abs(a.x - attachedX) - Math.abs(b.x - attachedX))[0];
        if (inline) return {
            player: inline,
            type: "inline"
        };
        const wing = sideSkill.filter((p)=>Math.abs(p.y - WING_Y) < 1.0 && Math.abs(p.x - wingX) <= 3.5 && Math.abs(p.x - tackleX) <= 8).sort((a, b)=>Math.abs(a.x - wingX) - Math.abs(b.x - wingX))[0];
        if (wing) return {
            player: wing,
            type: "wing"
        };
        return null;
    };
    const isTightBunchToEmolos = (side)=>{
        const name = formation.name.toLowerCase();
        const isBunchCall = name.includes("bunch") || name.startsWith("b ");
        if (isBunchCall) return true;
        const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
        const sideSkill = skill.filter((p)=>side === "left" ? p.x < 50 : p.x > 50);
        const tight = sideSkill.filter((p)=>Math.abs(p.x - attachedX) <= 6 && (Math.abs(p.y - LOS_Y) < 1.5 || Math.abs(p.y - OFF_Y) < 2));
        return tight.length >= 3;
    };
    const addSurface = (surfaceInfo, side)=>{
        if (!surfaceInfo) return;
        const tackleX = side === "left" ? xs[0] : xs[4];
        const towardCenter = side === "left" ? 2.2 : -2.2;
        const awayFromCenter = -towardCenter;
        if (isBunchFamilyOnSide(formation, side)) {
            const bunch = getBunchNumberedReceivers(formation, side);
            const numberThree = bunch.numberThree;
            const numberTwo = bunch.numberTwo;
            push(`dl-${side}-5t-bunch`, tackleX + (side === "left" ? -2.2 : 2.2), DL_Y, "5T", "dl");
            if (numberThree) {
                push(`dl-${side}-6i-bunch`, numberThree.x + towardCenter, DL_Y, "6i", "dl");
                push(`dl-${side}-6-bunch`, numberThree.x, DL_Y, "6T", "dl");
                push(`dl-${side}-7t-bunch`, numberThree.x + awayFromCenter, DL_Y, "7T", "dl");
            }
            if (numberTwo) {
                push(`dl-${side}-9t-bunch`, numberTwo.x, DL_Y, "9T", "dl");
            }
            return;
        }
        if (surfaceInfo.type === "inline") {
            const surface = surfaceInfo.player;
            const insideX = surface.x + towardCenter;
            const outsideX = surface.x + awayFromCenter;
            const attachedWing = getWingSurface(formation, side);
            push(`dl-${side}-6i`, insideX, DL_Y, "6i", "dl");
            push(`dl-${side}-6`, surface.x, DL_Y, "6", "dl");
            push(`dl-${side}-7t`, outsideX, DL_Y, "7T", "dl");
            if (attachedWing) {
                push(`dl-${side}-9t-wing`, attachedWing.x + awayFromCenter, DL_Y, "9T", "dl");
            }
            return;
        }
        const surface = surfaceInfo.player;
        push(`dl-${side}-6i-wing`, surface.x + towardCenter, DL_Y, "6i", "dl");
        push(`dl-${side}-6t`, surface.x, DL_Y, "6T", "dl");
        push(`dl-${side}-7t-wing`, surface.x + awayFromCenter, DL_Y, "7T", "dl");
    };
    addSurface(getFirstLevelSurface("left"), "left");
    addSurface(getFirstLevelSurface("right"), "right");
    push("lb-00", xs[2], LB_Y, "00T", "lb");
    push("lb-left-10", getMidpoint(xs[1], xs[2]), LB_Y, "10T", "lb");
    push("lb-left-20", xs[1], LB_Y, "20T", "lb");
    push("lb-left-30", getMidpoint(xs[0], xs[1]), LB_Y, "30T", "lb");
    push("lb-left-40", xs[0], LB_Y, "40T", "lb");
    push("lb-right-10", getMidpoint(xs[2], xs[3]), LB_Y, "10T", "lb");
    push("lb-right-20", xs[3], LB_Y, "20T", "lb");
    push("lb-right-30", getMidpoint(xs[3], xs[4]), LB_Y, "30T", "lb");
    push("lb-right-40", xs[4], LB_Y, "40T", "lb");
    const inlineLeft = getInlineSurface(formation, "left");
    const inlineRight = getInlineSurface(formation, "right");
    const wingLeft = getWingSurface(formation, "left");
    const wingRight = getWingSurface(formation, "right");
    const inlineTeIds = new Set([
        inlineLeft?.id,
        inlineRight?.id
    ].filter(Boolean));
    const pairedTeWingIds = new Set([
        ...inlineLeft && wingLeft ? [
            inlineLeft.id,
            wingLeft.id
        ] : [],
        ...inlineRight && wingRight ? [
            inlineRight.id,
            wingRight.id
        ] : []
    ]);
    const outsideLeft = getOutsideReceiver(formation, "left");
    const outsideRight = getOutsideReceiver(formation, "right");
    const outsideWideIds = new Set([
        outsideLeft,
        outsideRight
    ].filter((p)=>Boolean(p)).filter((p)=>!inlineTeIds.has(p.id) && !isWingLikePlayer(p) && (p.x < xs[0] || p.x > xs[4])).map((p)=>p.id));
    const addLbTeRule = (te, wing, side)=>{
        const tackleX = side === "left" ? xs[0] : xs[4];
        if (isBunchFamilyOnSide(formation, side)) {
            const bunch = getBunchNumberedReceivers(formation, side);
            const numberThree = bunch.numberThree;
            const numberTwo = bunch.numberTwo;
            const numberOne = bunch.numberOne;
            const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
            push(`lb-${side}-50t-bunch`, fiveTX, LB_Y, "50T", "lb");
            if (numberThree) push(`lb-${side}-num3-bunch`, numberThree.x, LB_Y, "H", "lb");
            if (numberTwo) push(`lb-${side}-num2-bunch`, numberTwo.x, LB_Y, "H", "lb");
            if (numberOne) push(`lb-${side}-num1-bunch`, numberOne.x, LB_Y, "H", "lb");
            return;
        }
        if (te) {
            const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
            push(`lb-${te.id}-50t`, fiveTX, LB_Y, "50T", "lb");
            const teOutsideX = side === "left" ? te.x - 2.8 : te.x + 2.8;
            push(`lb-${te.id}-60t`, te.x, LB_Y, "60T", "lb");
            if (wing) {
                // 70T = D gap between TE and Wing
                push(`lb-${te.id}-70t`, getMidpoint(te.x, wing.x), LB_Y, "70T", "lb");
                const wingOutsideX = side === "left" ? wing.x - 2.8 : wing.x + 2.8;
                push(`lb-${wing.id}-90t`, wingOutsideX, LB_Y, "90T", "lb");
            } else {
                // 70T = outside shoulder of TE when no wing
                const teOutsideX = side === "left" ? te.x - 2.8 : te.x + 2.8;
                push(`lb-${te.id}-70t`, teOutsideX, LB_Y, "70T", "lb");
            }
            return;
        }
        if (wing) {
            const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
            const wingOutsideX = side === "left" ? wing.x - 2.8 : wing.x + 2.8;
            push(`lb-${wing.id}-50t`, fiveTX, LB_Y, "50T", "lb");
            push(`lb-${wing.id}-60t`, wing.x, LB_Y, "60T", "lb");
            push(`lb-${wing.id}-70t`, wingOutsideX, LB_Y, "70T", "lb");
        } else {
            const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
            push(`lb-${side}-50t-open`, fiveTX, LB_Y, "50T", "lb");
        }
    };
    addLbTeRule(inlineLeft, inlineLeft && wingLeft ? wingLeft : null, "left");
    addLbTeRule(inlineRight, inlineRight && wingRight ? wingRight : null, "right");
    skill.forEach((p, idx)=>{
        const spread = 2.8 + idx % 3 * 0.4;
        const insideX = p.x < 50 ? p.x + spread : p.x - spread;
        const outsideX = p.x < 50 ? p.x - spread : p.x + spread;
        const isInline = inlineTeIds.has(p.id);
        const isWing = isWingLikePlayer(p);
        const isTightSurfacePair = pairedTeWingIds.has(p.id);
        const bunchLeft = isBunchFamilyOnSide(formation, "left") ? getBunchPlayers(formation, "left") : [];
        const bunchRight = isBunchFamilyOnSide(formation, "right") ? getBunchPlayers(formation, "right") : [];
        const bunchPlayers = [
            ...bunchLeft,
            ...bunchRight
        ];
        const bunchIndex = bunchPlayers.findIndex((bp)=>bp.id === p.id);
        if (!isInline && !isWing && bunchIndex === -1 && !outsideWideIds.has(p.id)) {
            push(`lb-${p.id}-i`, insideX, LB_Y, "I", "lb");
            push(`lb-${p.id}-h`, p.x, LB_Y, "H", "lb");
            push(`lb-${p.id}-o`, outsideX, LB_Y, "O", "lb");
        }
        if (bunchIndex !== -1) {
            // bunchIndex 0 = #3, 1 = #2, 2 = #1 by geometry
            if (bunchIndex === 0) {
                push(`cb-${p.id}-i-bunch`, insideX, CB_Y, "I", "cb");
                push(`db-${p.id}-h-bunch`, p.x, DB_Y, "H", "db");
            }
            if (bunchIndex === 1) {
                push(`cb-${p.id}-h-bunch`, p.x, CB_Y, "H", "cb");
            }
            if (bunchIndex === 2) {
                push(`cb-${p.id}-o-bunch`, outsideX, CB_Y, "O", "cb");
            }
            return;
        }
        if (isTightSurfacePair) {
            push(`cb-${p.id}-h`, p.x, CB_Y, "H", "cb");
            push(`db-${p.id}-h`, p.x, DB_Y, "H", "db");
            if (isInline) {
                push(`cb-${p.id}-i`, insideX, CB_Y, "I", "cb");
                push(`db-${p.id}-i`, insideX, DB_Y, "I", "db");
            }
            if (isWing) {
                push(`cb-${p.id}-o`, outsideX, CB_Y, "O", "cb");
                push(`db-${p.id}-o`, outsideX, DB_Y, "O", "db");
            }
            return;
        }
        push(`cb-${p.id}-i`, insideX, CB_Y, "I", "cb");
        push(`cb-${p.id}-h`, p.x, CB_Y, "H", "cb");
        push(`cb-${p.id}-o`, outsideX, CB_Y, "O", "cb");
        if (!outsideWideIds.has(p.id)) {
            push(`db-${p.id}-i`, insideX, DB_Y, "I", "db");
            push(`db-${p.id}-h`, p.x, DB_Y, "H", "db");
            push(`db-${p.id}-o`, outsideX, DB_Y, "O", "db");
        }
    });
    const apexEligibleSkill = formation.players.filter((p)=>{
        if (!isEligibleSkillPlayer(p)) return false;
        return p.x < xs[0] || p.x > xs[4];
    });
    const addApex = (side)=>{
        const tackleX = side === "left" ? xs[0] : xs[4];
        const sideSkill = apexEligibleSkill.filter((p)=>side === "left" ? p.x < 50 : p.x > 50).sort((a, b)=>Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
        if (!sideSkill.length) return;
        const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
        const wingX = side === "left" ? attachedX - (xs[1] - xs[0]) * 0.25 : attachedX + (xs[1] - xs[0]) * 0.25;
        const isWingLike = (p)=>(Math.abs(p.y - WING_Y) < 1.0 || Math.abs(p.y - OFF_Y) < 0.75) && Math.abs(p.x - wingX) <= 4;
        const inlineEmolos = sideSkill.find((p)=>Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - attachedX) <= 3.5 && Math.abs(p.x - tackleX) <= 8);
        const firstEligible = sideSkill[0];
        const isWingLikeFirstEligible = Boolean(firstEligible && isWingLike(firstEligible));
        if (!inlineEmolos && isWingLikeFirstEligible) return;
        const emolosX = inlineEmolos ? inlineEmolos.x : tackleX;
        const next = sideSkill.find((p)=>{
            if (inlineEmolos && p.id === inlineEmolos.id) return false;
            return side === "left" ? p.x < emolosX - 0.1 : p.x > emolosX + 0.1;
        }) || sideSkill.find((p)=>!(inlineEmolos && p.id === inlineEmolos.id));
        if (!next || isWingLike(next)) return;
        const apexX = getMidpoint(emolosX, next.x);
        push(`lb-${side}-apex`, apexX, LB_Y, "Apex", "lb");
        push(`db-${side}-apex`, apexX, DB_Y, "Apex", "db");
    };
    addApex("left");
    addApex("right");
    const getEligibles = (side)=>apexEligibleSkill.filter((p)=>side === "left" ? p.x < 50 : p.x > 50).sort((a, b)=>a.x - b.x);
    const isTightGroup = (group)=>{
        if (group.length < 2) return false;
        for(let i = 0; i < group.length - 1; i++){
            const dx = Math.abs(group[i].x - group[i + 1].x);
            if (dx > 6) return false;
        }
        return true;
    };
    [
        "left",
        "right"
    ].forEach((s)=>{
        const side = s;
        const group = getEligibles(side);
        if (isTightGroup(group)) return;
        if (group.length >= 2) {
            const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
            const wingX = side === "left" ? attachedX - (xs[1] - xs[0]) * 0.25 : attachedX + (xs[1] - xs[0]) * 0.25;
            const isWingLike = (p)=>(Math.abs(p.y - WING_Y) < 1.0 || Math.abs(p.y - OFF_Y) < 0.75) && Math.abs(p.x - wingX) <= 4;
            for(let i = 0; i < group.length - 1; i++){
                const a = group[i];
                const b = group[i + 1];
                if (isWingLike(a) || isWingLike(b)) continue;
                const extraApexX = (a.x + b.x) / 2;
                push(`lb-${side}-apex-extra-${a.id}-${b.id}`, extraApexX, LB_Y, "Apex", "lb");
                push(`db-${side}-apex-extra-${a.id}-${b.id}`, extraApexX, DB_Y, "Apex", "db");
            }
        }
    });
    [
        "left",
        "right"
    ].forEach((side)=>{
        const numberOne = getOutsideReceiver(formation, side);
        const numberTwo = getNumberTwoReceiver(formation, side);
        if (!numberOne || !numberTwo) return;
        push(`lb-${side}-apex-12`, getMidpoint(numberOne.x, numberTwo.x), LB_Y, "Apex", "lb");
    });
    push("db-left-edge", xs[0], DB_Y, "Edge", "db");
    push("db-left-hash", xs[1], DB_Y, "Hash", "db");
    push("db-mof", xs[2], DB_Y, "MOF", "db");
    push("db-right-hash", xs[3], DB_Y, "Hash", "db");
    push("db-right-edge", xs[4], DB_Y, "Edge", "db");
    return dedupeLandmarks(points);
}
function getOffenseAnswerKeyFromFormation(formation) {
    const answer = {};
    formation.players.filter((p)=>!FIXED_OL_IDS.includes(p.id)).forEach((p)=>{
        answer[p.id] = {
            x: p.x,
            y: p.y
        };
    });
    return answer;
}
function findLandmarkByLabel(landmarks, layer, label, side) {
    let filtered = landmarks.filter((p)=>p.layer === layer && p.label === label);
    if (side) filtered = filtered.filter((p)=>side === "left" ? p.x < 50 : p.x > 50);
    if (!filtered.length) return null;
    if (!side) return filtered[0];
    return side === "left" ? filtered.reduce((best, p)=>p.x > best.x ? p : best, filtered[0]) : filtered.reduce((best, p)=>p.x < best.x ? p : best, filtered[0]);
}
function findEligibleOnSide(formation, side) {
    return formation.players.filter((p)=>![
            ...FIXED_OL_IDS,
            "QB"
        ].includes(p.id)).filter((p)=>side === "left" ? p.x < 50 : p.x > 50);
}
function findTrueEligiblesOnSide(formation, side) {
    return findEligibleOnSide(formation, side).filter(countsAsNonBackfieldEligible);
}
function getOrderedReceivers(formation, side) {
    const players = findTrueEligiblesOnSide(formation, side);
    return [
        ...players
    ].sort((a, b)=>side === "left" ? a.x - b.x : b.x - a.x);
}
function getOutsideReceiver(formation, side) {
    const ordered = getOrderedReceivers(formation, side);
    return ordered[0] || null;
}
function getNumberTwoReceiver(formation, side) {
    const ordered = getOrderedReceivers(formation, side);
    return ordered.length >= 2 ? ordered[1] : null;
}
function getNumberThreeReceiver(formation, side) {
    const ordered = getOrderedReceivers(formation, side);
    return ordered.length >= 3 ? ordered[2] : null;
}
function getSlotReceiver(formation, side) {
    const numberTwo = getNumberTwoReceiver(formation, side);
    if (!numberTwo) return null;
    const inline = getInlineSurface(formation, side);
    const isInlineNumberTwo = inline?.id === numberTwo.id;
    const isWingNumberTwo = isWingLikePlayer(numberTwo);
    // A slot is defined by his relation to the OL, not by being on or off the ball.
    // So #2 counts as a slot if he is not the inline TE surface and not a wing.
    return !isInlineNumberTwo && !isWingNumberTwo ? numberTwo : null;
}
function getTightSurfaceSlotReceiver(formation, side) {
    return getSlotReceiver(formation, side);
}
function getInlineSurface(formation, side) {
    const tackleX = side === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4];
    const players = findEligibleOnSide(formation, side).filter((p)=>Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - tackleX) <= 10).sort((a, b)=>Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
    return players[0] || null;
}
function getWingSurface(formation, side) {
    const tackleX = side === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4];
    const players = findEligibleOnSide(formation, side).filter((p)=>Math.abs(p.y - WING_Y) < 0.75 && Math.abs(p.x - tackleX) <= 10).sort((a, b)=>Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
    return players[0] || null;
}
function getBunchPlayers(formation, side) {
    const tackleX = side === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4];
    const attachedX = getAttached(side, true);
    const sidePlayers = findEligibleOnSide(formation, side).sort((a, b)=>{
        const aScore = Math.abs(a.x - attachedX) + Math.abs(a.x - tackleX) * 0.35;
        const bScore = Math.abs(b.x - attachedX) + Math.abs(b.x - tackleX) * 0.35;
        return aScore - bScore;
    }).slice(0, 3).sort((a, b)=>Math.abs(a.x - 50) - Math.abs(b.x - 50));
    return sidePlayers;
}
function getBunchNumberedReceivers(formation, side) {
    const bunch = getBunchPlayers(formation, side);
    return {
        numberThree: bunch[0] || null,
        numberTwo: bunch[1] || null,
        numberOne: bunch[2] || null
    };
}
function isBunchFamilyOnSide(formation, side) {
    const name = formation.name.toLowerCase();
    if (!name.includes("bunch")) return false;
    const runSide = formation.runStrength;
    return side === runSide;
}
function hasTrueWideReceiverOnSide(formation, side) {
    return findEligibleOnSide(formation, side).some((p)=>isTrueWideReceiver(p));
}
function getBackfieldOffsetSide(formation) {
    const back = formation.players.find((p)=>[
            "RB",
            "F"
        ].includes(p.id) && Math.abs(p.y - OFF_Y) > 1 && p.x !== 50);
    if (!back) return null;
    return back.x < 50 ? "left" : "right";
}
function getFullbackOffsetSide(formation) {
    const fullback = formation.players.find((p)=>p.id === "F" && Math.abs(p.y - OFF_Y) > 1 && p.x !== 50);
    if (!fullback) return null;
    return fullback.x < 50 ? "left" : "right";
}
function isClosedSurfaceOnlySide(formation, side) {
    const inline = getInlineSurface(formation, side);
    const wing = getWingSurface(formation, side);
    const slot = getSlotReceiver(formation, side);
    return Boolean(inline || wing) && !hasTrueWideReceiverOnSide(formation, side) && !slot;
}
function shouldBossIlbs(formation) {
    const leftInline = getInlineSurface(formation, "left");
    const rightInline = getInlineSurface(formation, "right");
    const leftWing = getWingSurface(formation, "left");
    const rightWing = getWingSurface(formation, "right");
    // 🔥 NEW RULE: TE + Wing combo in 4-3 ALWAYS triggers boss
    const hasTEWingLeft = Boolean(leftInline && leftWing);
    const hasTEWingRight = Boolean(rightInline && rightWing);
    if (hasTEWingLeft || hasTEWingRight) return true;
    const leftEligibles = findTrueEligiblesOnSide(formation, "left");
    const rightEligibles = findTrueEligiblesOnSide(formation, "right");
    const leftCount = leftEligibles.length;
    const rightCount = rightEligibles.length;
    const isThreeByOne = leftCount === 3 && rightCount === 1 || leftCount === 1 && rightCount === 3;
    const closedThreeByOne = leftCount === 3 && isClosedSurfaceOnlySide(formation, "right") || rightCount === 3 && isClosedSurfaceOnlySide(formation, "left");
    if (isThreeByOne && !closedThreeByOne) return true;
    const fullbackSide = getFullbackOffsetSide(formation);
    const is21Personnel = formation.personnel === "21";
    const teFbSameSide = is21Personnel && (leftInline && fullbackSide === "left" || rightInline && fullbackSide === "right");
    if (teFbSameSide) return true;
    return false;
}
function shouldWillPlay50InEmpty(formation, willSide) {
    if (!formation.name.includes("Empty")) return false;
    const leftEligibles = findTrueEligiblesOnSide(formation, "left");
    const rightEligibles = findTrueEligiblesOnSide(formation, "right");
    const isThreeByTwo = leftEligibles.length === 3 && rightEligibles.length === 2 || leftEligibles.length === 2 && rightEligibles.length === 3;
    if (!isThreeByTwo) return false;
    return Boolean(getSlotReceiver(formation, willSide));
}
function getThreeByOneStrongSide(formation) {
    const leftCount = findTrueEligiblesOnSide(formation, "left").length;
    const rightCount = findTrueEligiblesOnSide(formation, "right").length;
    if (leftCount === 3 && rightCount === 1) return "left";
    if (rightCount === 3 && leftCount === 1) return "right";
    return null;
}
function shouldMikeApexFlexedThree(formation, mikeSide) {
    const strongSide = getThreeByOneStrongSide(formation);
    if (!strongSide || strongSide !== mikeSide) return false;
    if (isClosedSurfaceOnlySide(formation, mikeSide)) return false;
    const numberThree = getNumberThreeReceiver(formation, mikeSide);
    if (!numberThree) return false;
    const isFlexed = !isWingLikePlayer(numberThree) && Math.abs(numberThree.x - (mikeSide === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4])) > 8;
    return isFlexed;
}
function isAttachedOrWingNumberThree(formation, side) {
    const numberThree = getNumberThreeReceiver(formation, side);
    if (!numberThree) return false;
    const inline = getInlineSurface(formation, side);
    if (inline?.id === numberThree.id) return true;
    if (isWingLikePlayer(numberThree)) return true;
    return false;
}
function getAlignmentSpecialCases(formation, frontMode = "4-3") {
    const notes = [];
    const passStrength = formation.passStrength;
    const passAway = passStrength === "left" ? "right" : "left";
    const leftCount = findTrueEligiblesOnSide(formation, "left").length;
    const rightCount = findTrueEligiblesOnSide(formation, "right").length;
    const is22 = leftCount === 2 && rightCount === 2;
    const is31 = leftCount === 3 && rightCount === 1 || leftCount === 1 && rightCount === 3;
    const is32 = leftCount === 3 && rightCount === 2 || leftCount === 2 && rightCount === 3;
    const bossIlbs = shouldBossIlbs(formation);
    const mikeApexFlexedThree = shouldMikeApexFlexedThree(formation, passStrength);
    const willStrengthEligibles = findTrueEligiblesOnSide(formation, passStrength).length;
    const willWeakEligibles = findTrueEligiblesOnSide(formation, passAway).length;
    const strongInline = getInlineSurface(formation, formation.runStrength);
    const strongWing = getWingSurface(formation, formation.runStrength);
    const weakInline = getInlineSurface(formation, passAway);
    const weakWing = getWingSurface(formation, passAway);
    if (formation.name.includes("Quad")) {
        notes.push("Quad: Mike 30T.");
    }
    if (bossIlbs && !mikeApexFlexedThree) {
        notes.push("Boss: Mike to strength, Will away.");
    }
    if (mikeApexFlexedThree) {
        notes.push("Mike: apex flexed #3.");
    }
    const mikeStrengthEligibles = findTrueEligiblesOnSide(formation, passStrength).length;
    const closedAndBoss43Notes = frontMode === "4-3" && Boolean(isClosedSurfaceOnlySide(formation, "left") && !isClosedSurfaceOnlySide(formation, "right") || isClosedSurfaceOnlySide(formation, "right") && !isClosedSurfaceOnlySide(formation, "left")) && bossIlbs;
    if (closedAndBoss43Notes) {
        notes.push("Closed + boss: Mike and Will to 20T toward TE/FB.");
    } else if (mikeStrengthEligibles === 3) {
        notes.push("Mike: to strength. 60T if #3 attached, apex if #3 flexed.");
    } else {
        notes.push("Mike: to strength. 10T with run strength, 30T away.");
    }
    if (formation.name.includes("Empty") && is32) {
        notes.push("3x2 Empty: Ni on #2 WR, Will 50T weak, Mike 60T or apex.");
        notes.push("Empty: BS inside #2 weak.");
    }
    if (willStrengthEligibles === 3) {
        notes.push(willWeakEligibles === 2 ? "Will: 50T weak vs 3x2." : "Will: 00T weak vs 3x1.");
    } else {
        notes.push("Will: apex weak slot, else open gap.");
    }
    if (is22) {
        notes.push("2x2: ILBs in open gap.");
        notes.push("2x2: safeties inside slot #2, outside attached #2.");
    }
    if (is31) {
        notes.push("3x1: FS apex #2 and #3.");
    }
    if (strongWing) {
        notes.push("Wing adjust: DE widens strong.");
    }
    if (weakWing) {
        notes.push("Wing adjust: DE widens weak.");
    }
    if (strongInline && strongWing) {
        notes.push("TE/Wing strong: 7T/9T.");
    }
    if (weakInline && weakWing) {
        notes.push("TE/Wing weak: 7T/9T.");
    }
    if (formation.name.toLowerCase().includes("bunch")) {
        notes.push("Bunch: #3 gets 6i/6/7, #2 gets 9T.");
        notes.push("Bunch: Mike 50T, Ni on #1, FS on #3.");
    }
    return notes;
}
function getAlignmentAnswerKey(formation, landmarks, frontMode = "4-3") {
    const answer = {};
    const runStrength = formation.runStrength;
    const weakSide = runStrength === "left" ? "right" : "left";
    const passStrength = formation.passStrength;
    const passAway = passStrength === "left" ? "right" : "left";
    const getShade = (player, layer, label)=>{
        if (!player) return null;
        const pts = landmarks.filter((p)=>p.layer === layer && p.label === label && Math.abs(p.x - player.x) <= 6).sort((a, b)=>Math.abs(a.x - player.x) - Math.abs(b.x - player.x));
        return pts[0] || null;
    };
    const strongInline = getInlineSurface(formation, runStrength);
    const strongWing = getWingSurface(formation, runStrength);
    const weakInline = getInlineSurface(formation, weakSide);
    const weakWing = getWingSurface(formation, weakSide);
    const multipleTes = Boolean(strongInline && weakInline);
    const tPoint = findLandmarkByLabel(landmarks, "dl", "3T", runStrength);
    const nPoint = findLandmarkByLabel(landmarks, "dl", "2i", weakSide);
    const sdeFive = findLandmarkByLabel(landmarks, "dl", "5T", runStrength);
    const sdeSix = findLandmarkByLabel(landmarks, "dl", "6", runStrength) || findLandmarkByLabel(landmarks, "dl", "6T", runStrength);
    const sdeNine = findLandmarkByLabel(landmarks, "dl", "7T", runStrength) || findLandmarkByLabel(landmarks, "dl", "9T", runStrength);
    const wdeFive = findLandmarkByLabel(landmarks, "dl", "5T", weakSide);
    const wdeSix = findLandmarkByLabel(landmarks, "dl", "6", weakSide) || findLandmarkByLabel(landmarks, "dl", "6T", weakSide);
    const wdeNine = findLandmarkByLabel(landmarks, "dl", "7T", weakSide) || findLandmarkByLabel(landmarks, "dl", "9T", weakSide);
    if (tPoint) answer.T = {
        x: tPoint.x,
        y: tPoint.y
    };
    if (nPoint) answer.N = {
        x: nPoint.x,
        y: nPoint.y
    };
    if (strongInline && strongWing && sdeNine) answer.SDE = {
        x: sdeNine.x,
        y: sdeNine.y
    };
    else if (!strongInline && strongWing && sdeSix) answer.SDE = {
        x: sdeSix.x,
        y: sdeSix.y
    };
    else if (strongInline && sdeSix) answer.SDE = {
        x: sdeSix.x,
        y: sdeSix.y
    };
    else if (sdeFive) answer.SDE = {
        x: sdeFive.x,
        y: sdeFive.y
    };
    if (weakInline && weakWing && wdeNine) answer.WDE = {
        x: wdeNine.x,
        y: wdeNine.y
    };
    else if (weakInline && multipleTes && wdeSix) answer.WDE = {
        x: wdeSix.x,
        y: wdeSix.y
    };
    else if (!weakInline && weakWing && wdeSix) answer.WDE = {
        x: wdeSix.x,
        y: wdeSix.y
    };
    else if (weakWing && wdeSix) answer.WDE = {
        x: wdeSix.x,
        y: wdeSix.y
    };
    else if (wdeFive) answer.WDE = {
        x: wdeFive.x,
        y: wdeFive.y
    };
    const bossIlbs = shouldBossIlbs(formation);
    const mikeSide = passStrength;
    const willSide = passAway;
    const mikeOnRunSide = mikeSide === runStrength;
    const willOnRunSide = willSide === runStrength;
    const leftClosed = isClosedSurfaceOnlySide(formation, "left");
    const rightClosed = isClosedSurfaceOnlySide(formation, "right");
    const cometSide = leftClosed && !rightClosed ? "left" : rightClosed && !leftClosed ? "right" : null;
    let cometTe = null;
    let cometWing = null;
    if (cometSide) {
        cometTe = getInlineSurface(formation, cometSide);
        cometWing = getWingSurface(formation, cometSide);
        const cometLabel = !cometTe ? "50T" : cometTe && cometWing ? "90T" : "70T";
        const cometSpot = findLandmarkByLabel(landmarks, "lb", cometLabel, cometSide);
        if (cometSpot) answer.BC = {
            x: cometSpot.x,
            y: cometSpot.y
        };
    }
    const closedThreeByOne = cometSide === passAway && findTrueEligiblesOnSide(formation, passStrength).length === 3;
    const nonClosedBoss43 = frontMode === "4-3" && !cometSide && bossIlbs && findTrueEligiblesOnSide(formation, passStrength).length !== 3;
    const nonClosedBoss44 = frontMode === "4-4" && !cometSide && bossIlbs && findTrueEligiblesOnSide(formation, passStrength).length !== 3;
    const closedAndBoss43 = frontMode === "4-3" && Boolean(cometSide) && bossIlbs;
    const closedAndBoss44 = frontMode === "4-4" && Boolean(cometSide) && bossIlbs;
    const closedNoBoss44 = frontMode === "4-4" && Boolean(cometSide) && !bossIlbs;
    const strongBunch = isBunchFamilyOnSide(formation, mikeSide) ? getBunchNumberedReceivers(formation, mikeSide) : null;
    const mikeStrengthEligibles = findTrueEligiblesOnSide(formation, mikeSide).length;
    const mikeLandmark = (()=>{
        if (closedThreeByOne) return findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
        if (nonClosedBoss43) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
        if (nonClosedBoss44) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
        if (closedAndBoss43) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
        if (closedAndBoss44) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
        if (closedNoBoss44) return findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
        if (strongBunch?.numberThree) return findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
        if (formation.name.includes("Quad")) return findLandmarkByLabel(landmarks, "lb", "30T", mikeSide);
        if (mikeStrengthEligibles === 3) {
            if (isAttachedOrWingNumberThree(formation, mikeSide)) return findLandmarkByLabel(landmarks, "lb", "60T", mikeSide);
            return findLandmarkByLabel(landmarks, "lb", "Apex", mikeSide);
        }
        return findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    })();
    if (mikeLandmark) answer.M = {
        x: mikeLandmark.x,
        y: mikeLandmark.y
    };
    const willLandmark = (()=>{
        const strengthEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;
        // 🔥 FIX: Proper 4-3 Closed Boss behavior (split 20Ts)
        if (closedThreeByOne) {
            return findLandmarkByLabel(landmarks, "lb", "10T", passStrength) || findLandmarkByLabel(landmarks, "lb", "10T", willSide);
        }
        if (nonClosedBoss43) {
            const will20 = findLandmarkByLabel(landmarks, "lb", "20T", willSide);
            return will20 || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
        }
        if (nonClosedBoss44) {
            const will20 = findLandmarkByLabel(landmarks, "lb", "20T", willSide);
            return will20 || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
        }
        if (closedAndBoss43) {
            const will20 = findLandmarkByLabel(landmarks, "lb", "20T", willSide);
            return will20 || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
        }
        if (frontMode === "4-4") {
            if (closedAndBoss44) {
                return findLandmarkByLabel(landmarks, "lb", "20T", willSide) || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
            }
            if (closedNoBoss44) {
                return findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
            }
            if (strengthEligibleCount === 3) {
                return findLandmarkByLabel(landmarks, "lb", "00T");
            }
            if (bossIlbs) {
                return findLandmarkByLabel(landmarks, "lb", "00T") || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
            }
            return findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
        }
        const weakEligibleCount = findTrueEligiblesOnSide(formation, willSide).length;
        const willSlot = getSlotReceiver(formation, willSide);
        if (closedThreeByOne) {
            return findLandmarkByLabel(landmarks, "lb", "10T", passStrength) || findLandmarkByLabel(landmarks, "lb", "10T", willSide);
        }
        if (bossIlbs) {
            if (strengthEligibleCount === 3 && weakEligibleCount !== 2) return findLandmarkByLabel(landmarks, "lb", "00T");
            return findLandmarkByLabel(landmarks, "lb", "50T", willSide) || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
        }
        if (strengthEligibleCount === 3) {
            if (weakEligibleCount === 2) return findLandmarkByLabel(landmarks, "lb", "50T", willSide);
            return findLandmarkByLabel(landmarks, "lb", "00T");
        }
        if (willSlot) return findLandmarkByLabel(landmarks, "lb", "Apex", willSide);
        return findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
    })();
    if (willLandmark) answer.W = {
        x: willLandmark.x,
        y: willLandmark.y
    };
    const applyOverhangRule = (side, targetId)=>{
        const sideBunch = isBunchFamilyOnSide(formation, side) ? getBunchNumberedReceivers(formation, side) : null;
        const sideSlot = getSlotReceiver(formation, side);
        const sideNumberTwo = getNumberTwoReceiver(formation, side);
        const sideOutside = getOutsideReceiver(formation, side);
        const sideEligibleCount = findTrueEligiblesOnSide(formation, side).length;
        if (sideBunch?.numberOne) {
            answer[targetId] = {
                x: sideBunch.numberOne.x,
                y: LB_Y
            };
            return;
        }
        if (cometSide && cometSide === side) {
            const strongEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;
            // 4-4 weak overhang rule: if the closed side has no TE, treat the tackle like the TE
            // and align BS in the next open gap on that closed side.
            if (targetId === "BS" && frontMode === "4-4" && side === passAway && !cometTe) {
                const bsTackleGap = findLandmarkByLabel(landmarks, "lb", "30T", side);
                if (bsTackleGap) answer[targetId] = {
                    x: bsTackleGap.x,
                    y: bsTackleGap.y
                };
                return;
            }
            const singleSurfaceCometBump = targetId === "BS" && frontMode === "4-4" && side === passAway && strongEligibleCount === 3 && !(cometTe && cometWing) && (Boolean(cometTe) || Boolean(cometWing));
            const bumpLabel = singleSurfaceCometBump ? "30T" : cometTe && cometWing ? "50T" : "40T";
            const bump = findLandmarkByLabel(landmarks, "lb", bumpLabel, side);
            if (bump) answer[targetId] = {
                x: bump.x,
                y: bump.y
            };
            return;
        }
        if ((sideEligibleCount === 2 || sideEligibleCount === 3) && sideNumberTwo) {
            if (sideSlot) {
                answer[targetId] = {
                    x: sideNumberTwo.x,
                    y: LB_Y
                };
            } else {
                const outsideX = sideOutside?.x ?? sideNumberTwo.x;
                const targetApexX = getMidpoint(outsideX, sideNumberTwo.x);
                const apex = landmarks.filter((p)=>p.layer === "lb" && p.label === "Apex").sort((a, b)=>Math.abs(a.x - targetApexX) - Math.abs(b.x - targetApexX))[0] || findLandmarkByLabel(landmarks, "lb", "Apex", side);
                if (apex) answer[targetId] = {
                    x: apex.x,
                    y: apex.y
                };
            }
            return;
        }
        const apex = findLandmarkByLabel(landmarks, "lb", "Apex", side);
        if (apex) answer[targetId] = {
            x: apex.x,
            y: apex.y
        };
    };
    applyOverhangRule(passStrength, "Ni");
    const leftElig = findTrueEligiblesOnSide(formation, "left").length;
    const rightElig = findTrueEligiblesOnSide(formation, "right").length;
    const is22 = leftElig === 2 && rightElig === 2;
    const is31 = leftElig === 3 && rightElig === 1 || leftElig === 1 && rightElig === 3;
    const is32 = leftElig === 3 && rightElig === 2 || leftElig === 2 && rightElig === 3;
    const fsNumberTwo = getNumberTwoReceiver(formation, passStrength);
    const fsNumberThree = getNumberThreeReceiver(formation, passStrength);
    const bsNumberTwo = getNumberTwoReceiver(formation, passAway);
    const fsSlot = getSlotReceiver(formation, passStrength);
    const bsSlot = getSlotReceiver(formation, passAway);
    const fsApex = findLandmarkByLabel(landmarks, "db", "Apex", passStrength);
    const bsApex = findLandmarkByLabel(landmarks, "db", "Apex", passAway);
    const fsInline = getInlineSurface(formation, passStrength);
    const bsInline = getInlineSurface(formation, passAway);
    const fcTarget = getOutsideReceiver(formation, passStrength);
    const bcTarget = getOutsideReceiver(formation, passAway);
    const fsStrengthEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;
    const xReceiver = formation.players.find((p)=>p.id === "X") || null;
    if (formation.playbook === "Wing T" && xReceiver) {
        const fc = getShade(xReceiver, "cb", "H");
        if (fc) answer.FC = {
            x: fc.x,
            y: fc.y
        };
    } else if (strongBunch?.numberOne) {
        const fc = getShade(strongBunch.numberOne, "cb", "O");
        if (fc) answer.FC = {
            x: fc.x,
            y: fc.y
        };
    } else if (fcTarget) {
        const fc = getShade(fcTarget, "cb", "H");
        if (fc) answer.FC = {
            x: fc.x,
            y: fc.y
        };
    }
    if (frontMode === "4-4") {
        if (strongBunch?.numberThree) {
            const fs = getShade(strongBunch.numberThree, "db", "H");
            if (fs) answer.FS = {
                x: fs.x,
                y: fs.y
            };
        } else if (formation.name.includes("Quad")) {
            const post = findLandmarkByLabel(landmarks, "db", "MOF");
            if (post) answer.FS = {
                x: post.x,
                y: post.y
            };
        } else if (is22) {
            if (!cometSide) {
                const post = findLandmarkByLabel(landmarks, "db", "MOF");
                if (post) answer.FS = {
                    x: post.x,
                    y: post.y
                };
            } else {
                const closedTe = getInlineSurface(formation, cometSide);
                const closedWing = getWingSurface(formation, cometSide);
                if (closedTe && closedWing) {
                    const post = findLandmarkByLabel(landmarks, "db", "MOF");
                    if (post) answer.FS = {
                        x: post.x,
                        y: post.y
                    };
                } else {
                    const closedFirstEligible = getNumberThreeReceiver(formation, cometSide) || getNumberTwoReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
                    const fs = getShade(closedFirstEligible, "db", "I");
                    if (fs) answer.FS = {
                        x: fs.x,
                        y: fs.y
                    };
                }
            }
        } else if (fsStrengthEligibleCount === 3 && fsNumberThree) {
            if (cometSide && cometSide === passAway) {
                const post = findLandmarkByLabel(landmarks, "db", "MOF");
                if (post) answer.FS = {
                    x: post.x,
                    y: post.y
                };
            } else {
                const fs = getShade(fsNumberThree, "db", "I");
                if (fs) answer.FS = {
                    x: fs.x,
                    y: fs.y
                };
            }
        } else {
            const post = findLandmarkByLabel(landmarks, "db", "MOF");
            if (post) answer.FS = {
                x: post.x,
                y: post.y
            };
        }
        if (!answer.BC && bcTarget) {
            const bc = getShade(bcTarget, "cb", "H");
            if (bc) answer.BC = {
                x: bc.x,
                y: bc.y
            };
        }
        applyOverhangRule(passAway, "BS");
    } else {
        if (cometSide && cometSide === passStrength) {
            const cometFirstEligible = getNumberTwoReceiver(formation, cometSide) || getOutsideReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
            const fs = getShade(cometFirstEligible, "db", "I");
            if (fs) answer.FS = {
                x: fs.x,
                y: fs.y
            };
        } else if (strongBunch?.numberThree) {
            const fs = getShade(strongBunch.numberThree, "db", "H");
            if (fs) answer.FS = {
                x: fs.x,
                y: fs.y
            };
        } else if (is22) {
            if (fsSlot) {
                const fs = getShade(fsSlot, "db", "I");
                if (fs) answer.FS = {
                    x: fs.x,
                    y: fs.y
                };
            } else if (fsNumberTwo) {
                const fs = getShade(fsNumberTwo, "db", "O");
                if (fs) answer.FS = {
                    x: fs.x,
                    y: fs.y
                };
            }
        } else if (fsStrengthEligibleCount === 3 && fsNumberThree && !isAttachedOrWingNumberThree(formation, passStrength)) {
            const fs = getShade(fsNumberThree, "db", "I");
            if (fs) answer.FS = {
                x: fs.x,
                y: fs.y
            };
        } else if (fsApex && (is31 || is32)) {
            answer.FS = {
                x: fsApex.x,
                y: fsApex.y
            };
        } else if (fsInline && fcTarget) {
            const fs = getShade(fsInline, "db", "O");
            if (fs) answer.FS = {
                x: fs.x,
                y: fs.y
            };
        } else {
            const edge = findLandmarkByLabel(landmarks, "db", "Edge", passStrength);
            if (edge) answer.FS = {
                x: edge.x,
                y: edge.y
            };
        }
        if (!answer.BC && bcTarget) {
            const bc = getShade(bcTarget, "cb", "H");
            if (bc) answer.BC = {
                x: bc.x,
                y: bc.y
            };
        }
        if (cometSide && cometSide === passAway) {
            const cometFirstEligible = getNumberTwoReceiver(formation, cometSide) || getOutsideReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
            const bs = getShade(cometFirstEligible, "db", "I");
            if (bs) answer.BS = {
                x: bs.x,
                y: bs.y
            };
        } else if (formation.name.includes("Empty") && is32) {
            const bs = getShade(bsNumberTwo, "db", "I");
            if (bs) answer.BS = {
                x: bs.x,
                y: bs.y
            };
        } else if (is22) {
            if (bsSlot) {
                const bs = getShade(bsSlot, "db", "I");
                if (bs) answer.BS = {
                    x: bs.x,
                    y: bs.y
                };
            } else if (bsNumberTwo) {
                const bs = getShade(bsNumberTwo, "db", "O");
                if (bs) answer.BS = {
                    x: bs.x,
                    y: bs.y
                };
            }
        } else if (is31) {
            const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
            if (edge) answer.BS = {
                x: edge.x,
                y: edge.y
            };
        } else if (bsInline && bcTarget) {
            const bs = getShade(bsInline, "db", "O");
            if (bs) answer.BS = {
                x: bs.x,
                y: bs.y
            };
        } else {
            const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
            if (edge) answer.BS = {
                x: edge.x,
                y: edge.y
            };
        }
    }
    return answer;
}
function getCheckResult(currentPlacements, answerKey, threshold = 0.75) {
    const ghosts = Object.entries(answerKey).map(([id, pos])=>({
            id,
            x: pos.x,
            y: pos.y
        }));
    const incorrectIds = currentPlacements.filter((p)=>{
        const target = answerKey[p.id];
        if (!target) return false;
        return Math.hypot(target.x - p.x, target.y - p.y) > threshold;
    }).map((p)=>p.id);
    const requiredIds = Object.keys(answerKey);
    const placedIds = new Set(currentPlacements.map((p)=>p.id));
    const isCorrect = incorrectIds.length === 0 && requiredIds.every((id)=>placedIds.has(id));
    return {
        incorrectIds,
        ghosts,
        isCorrect
    };
}
function nearestLandmark(x, y, points) {
    if (!points.length) return {
        x,
        y
    };
    return points.reduce((best, p)=>{
        const bestDist = Math.hypot(best.x - x, best.y - y);
        const currentDist = Math.hypot(p.x - x, p.y - y);
        return currentDist < bestDist ? p : best;
    }, points[0]);
}
function Circle({ player, color = "bg-orange-600", text = "text-white", border = "border-white/30" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-bold shadow ${color} ${text} ${border}`,
        style: {
            left: `${player.x}%`,
            top: `${player.y}%`
        },
        children: player.id
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1596,
        columnNumber: 5
    }, this);
}
_c = Circle;
function TrainingField({ enhancedLandmarks = false, offensePlayers, offenseLandmarks = [], defensePlayers = [], defenseLandmarks = [], offenseGhosts = [], defenseGhosts = [], editableDefenseGhosts = false, incorrectOffenseIds = [], incorrectDefenseIds = [], overlayLabel, flipOffense = false, editableOffense = false, editableDefense = false, offenseGhostOffset = 0, dimOffenseOnAnswers = false, lockedOffenseIds = FIXED_OL_IDS, onMoveOffense, onMoveDefense, onMoveDefenseGhost }) {
    _s();
    const [drag, setDrag] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const maybeFlipY = (y, enabled)=>enabled ? 100 - y : y;
    const getPointer = (e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const x = clamp((e.clientX - rect.left) / rect.width * 100, 2, 98);
        const rawY = clamp((e.clientY - rect.top) / rect.height * 100, 2, 98);
        const y = drag?.type === "offense" && flipOffense ? 100 - rawY : rawY;
        return {
            x,
            y
        };
    };
    const handlePointerMove = (e)=>{
        if (!drag) return;
        const { x, y } = getPointer(e);
        if (drag.type === "offense" && onMoveOffense) onMoveOffense(drag.id, x, y);
        if (drag.type === "defense" && onMoveDefense) onMoveDefense(drag.id, x, y);
        if (drag.type === "defense_ghost" && onMoveDefenseGhost) onMoveDefenseGhost(drag.id, x, y);
    };
    const handlePointerUp = (e)=>{
        if (!drag) return;
        const { x, y } = getPointer(e);
        if (drag.type === "offense" && onMoveOffense) {
            const snap = nearestLandmark(x, y, offenseLandmarks);
            onMoveOffense(drag.id, snap.x, snap.y);
        }
        if (drag.type === "defense" && onMoveDefense) {
            const snap = nearestLandmark(x, y, defenseLandmarks);
            onMoveDefense(drag.id, snap.x, snap.y);
        }
        if (drag.type === "defense_ghost" && onMoveDefenseGhost) {
            const snap = nearestLandmark(x, y, defenseLandmarks);
            onMoveDefenseGhost(drag.id, snap.x, snap.y);
        }
        setDrag(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-emerald-700",
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerLeave: ()=>setDrag(null),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1692,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 right-0 border-t-2 border-dashed border-white/70",
                style: {
                    top: `${flipOffense ? 100 - 52 : 52}%`
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1693,
                columnNumber: 7
            }, this),
            getLineXs(editableDefense).map((x, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-[10%] top-[10%] w-px bg-sky-200/25",
                    style: {
                        left: `${x}%`
                    }
                }, idx, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1695,
                    columnNumber: 9
                }, this)),
            offenseLandmarks.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -translate-x-1/2 -translate-y-1/2",
                    style: {
                        left: `${p.x}%`,
                        top: `${maybeFlipY(p.y, flipOffense)}%`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 w-2 rounded-full border border-pink-100/80 bg-pink-200/50"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1700,
                        columnNumber: 11
                    }, this)
                }, p.id, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1699,
                    columnNumber: 9
                }, this)),
            defenseLandmarks.map((p)=>{
                const showingAnswers = defenseGhosts.length > 0;
                const layerStyles = enhancedLandmarks ? {
                    dl: "bg-red-300/40 border-red-100/50",
                    lb: "bg-amber-200/40 border-amber-50/50",
                    cb: "bg-blue-300/40 border-blue-100/50",
                    db: "bg-violet-300/40 border-violet-100/50"
                } : {
                    dl: "bg-sky-200/30 border-sky-100/50",
                    lb: "bg-sky-200/30 border-sky-100/50",
                    cb: "bg-sky-200/30 border-sky-100/50",
                    db: "bg-sky-200/30 border-sky-100/50"
                };
                const size = enhancedLandmarks ? "h-2.5 w-2.5" : "h-2 w-2";
                const labelClass = enhancedLandmarks ? "text-[9px] font-semibold text-white/80" : "text-[9px] font-semibold text-sky-50/80";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -translate-x-1/2 -translate-y-1/2",
                    style: {
                        left: `${p.x}%`,
                        top: `${p.y}%`
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `rounded-full border ${size} ${layerStyles[p.layer]}`
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 1725,
                            columnNumber: 13
                        }, this),
                        p.label ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap ${labelClass}`,
                            children: p.label
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 1726,
                            columnNumber: 24
                        }, this) : null
                    ]
                }, p.id, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1724,
                    columnNumber: 11
                }, this);
            }),
            offenseGhosts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -translate-x-1/2 -translate-y-1/2",
                    style: {
                        left: `${clamp(p.x + offenseGhostOffset, 2, 98)}%`,
                        top: `${maybeFlipY(p.y, flipOffense)}%`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-300 border-dashed bg-white/80 text-[10px] font-bold text-slate-900",
                        children: p.id
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1733,
                        columnNumber: 11
                    }, this)
                }, `og-${p.id}`, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1732,
                    columnNumber: 9
                }, this)),
            defenseGhosts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -translate-x-1/2 -translate-y-1/2",
                    style: {
                        left: `${p.x}%`,
                        top: `${p.y}%`
                    },
                    onPointerDown: ()=>{
                        if (!editableDefenseGhosts) return;
                        setDrag({
                            id: p.id,
                            type: "defense_ghost"
                        });
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 border-dashed bg-sky-200/10 text-[10px] font-bold text-black",
                        children: p.id
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1746,
                        columnNumber: 11
                    }, this)
                }, `dg-${p.id}`, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1737,
                    columnNumber: 9
                }, this)),
            offensePlayers.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        opacity: dimOffenseOnAnswers ? 0.35 : 1
                    },
                    onPointerDown: ()=>{
                        if (!editableOffense) return;
                        if (lockedOffenseIds.includes(p.id)) return;
                        setDrag({
                            id: p.id,
                            type: "offense"
                        });
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Circle, {
                        player: {
                            ...p,
                            y: maybeFlipY(p.y, flipOffense)
                        },
                        color: incorrectOffenseIds.includes(p.id) ? "bg-red-500" : undefined,
                        border: incorrectOffenseIds.includes(p.id) ? "border-red-300" : undefined
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1759,
                        columnNumber: 11
                    }, this)
                }, p.id, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1750,
                    columnNumber: 9
                }, this)),
            defensePlayers.map((p)=>{
                const showingAnswers = defenseGhosts.length > 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onPointerDown: ()=>{
                        if (!editableDefense) return;
                        setDrag({
                            id: p.id,
                            type: "defense"
                        });
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Circle, {
                        player: p,
                        color: incorrectDefenseIds.includes(p.id) ? "bg-red-500" : "bg-sky-600",
                        text: showingAnswers ? "text-black" : "text-white",
                        border: incorrectDefenseIds.includes(p.id) ? "border-red-300" : "border-sky-200/40"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1776,
                        columnNumber: 13
                    }, this)
                }, p.id, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1769,
                    columnNumber: 11
                }, this);
            }),
            overlayLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-4 rounded-lg bg-black/20 px-3 py-1 text-xs font-medium text-white/90",
                children: overlayLabel
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1786,
                columnNumber: 23
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1686,
        columnNumber: 5
    }, this);
}
_s(TrainingField, "AHzoynSyIoDOQKiIwIHasJWqWMI=");
_c1 = TrainingField;
function TokenTray({ title, ids, onAdd }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border bg-white p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 text-sm font-semibold text-slate-700",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1794,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: ids.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        className: "rounded-xl",
                        onClick: ()=>onAdd(id),
                        children: id
                    }, id, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1797,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1795,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1793,
        columnNumber: 5
    }, this);
}
_c2 = TokenTray;
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}
function FormationRecognitionWorkingApp() {
    _s1();
    const [enhancedLandmarks, setEnhancedLandmarks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [frontMode, setFrontMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("4-3");
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("study");
    const [loginName, setLoginName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [teamCodeInput, setTeamCodeInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Foothill");
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [leaderboard, setLeaderboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scoredAttemptKey, setScoredAttemptKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [attemptStartedAt, setAttemptStartedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Date.now());
    const [selectedPlaybooks, setSelectedPlaybooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "Foothill",
        "Pro",
        "Wing T"
    ]);
    const [personnelFilter, setPersonnelFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Any");
    const [index, setIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [quizAnswers, setQuizAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        formation: "",
        runStrength: "",
        passStrength: ""
    });
    const [showQuizFeedback, setShowQuizFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuizAnswers, setShowQuizAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quizReadyForNext, setQuizReadyForNext] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [alignmentPlacements, setAlignmentPlacements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [offensePlacements, setOffensePlacements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [showAlignmentCheck, setShowAlignmentCheck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showOffenseCheck, setShowOffenseCheck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editorOverrides, setEditorOverrides] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [customAlignmentLandmarks, setCustomAlignmentLandmarks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingAlignmentAnswers, setEditingAlignmentAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customLandmarkDraft, setCustomLandmarkDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        label: "",
        layer: "lb",
        side: "right",
        x: "75",
        y: String(LB_Y)
    });
    const [editorDraft, setEditorDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        personnel: "11",
        runStrength: "right",
        passStrength: "right",
        backfield: "Under Center"
    });
    const effectivePlaybooks = mode === "offense_build" ? [
        "Foothill"
    ] : selectedPlaybooks;
    const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[pool]": ()=>{
            return ALL_FORMATIONS.filter({
                "FormationRecognitionWorkingApp.useMemo[pool]": (f)=>effectivePlaybooks.includes(f.playbook) && (personnelFilter === "Any" || f.personnel === personnelFilter)
            }["FormationRecognitionWorkingApp.useMemo[pool]"]);
        }
    }["FormationRecognitionWorkingApp.useMemo[pool]"], [
        effectivePlaybooks,
        personnelFilter
    ]);
    const current = pool[index % Math.max(pool.length, 1)] ?? ALL_FORMATIONS[0];
    const formationKey = `${current.playbook}::${current.name}`;
    const displayFormation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[displayFormation]": ()=>{
            let base;
            if (current.playbook === "Wing T" || current.name.startsWith("Wing T")) {
                base = buildWingTFormation(current.name, mode === "alignment");
            } else if (current.playbook === "Foothill") {
                base = buildFoothillFormation(current.name, mode === "alignment");
            } else {
                base = buildProFormation(current.name, mode === "alignment");
            }
            const override = editorOverrides[formationKey];
            return override ? {
                ...base,
                ...override,
                players: override.players ?? base.players
            } : base;
        }
    }["FormationRecognitionWorkingApp.useMemo[displayFormation]"], [
        current,
        formationKey,
        mode,
        editorOverrides
    ]);
    const alignmentLandmarks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[alignmentLandmarks]": ()=>{
            return getAlignmentLandmarks(displayFormation);
        }
    }["FormationRecognitionWorkingApp.useMemo[alignmentLandmarks]"], [
        displayFormation
    ]);
    const offenseLandmarks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[offenseLandmarks]": ()=>getOffenseBuildLandmarks()
    }["FormationRecognitionWorkingApp.useMemo[offenseLandmarks]"], []);
    const alignmentPlayers = alignmentPlacements[formationKey] ?? [];
    const offenseBuildPlayers = offensePlacements[formationKey] ?? [];
    const remainingDefenders = DEFENDER_TOKENS.filter((id)=>!alignmentPlayers.some((p)=>p.id === id));
    const remainingOffense = OFFENSE_TOKENS.filter((id)=>!offenseBuildPlayers.some((p)=>p.id === id));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            setShowQuizFeedback(false);
            setShowQuizAnswers(false);
            setQuizReadyForNext(false);
            setShowAlignmentCheck(false);
            setShowOffenseCheck(false);
            setEditingAlignmentAnswers(false);
            setQuizAnswers({
                formation: "",
                runStrength: "",
                passStrength: ""
            });
            setScoredAttemptKey(null);
            setAttemptStartedAt(Date.now());
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        current.name,
        mode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            setEditorDraft({
                name: displayFormation.name,
                personnel: displayFormation.personnel,
                runStrength: displayFormation.runStrength,
                passStrength: displayFormation.passStrength,
                backfield: displayFormation.backfield
            });
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        displayFormation
    ]);
    const nextCall = ()=>{
        if (!pool.length) return;
        setIndex((prev)=>{
            if (pool.length === 1) return 0;
            let next = prev;
            while(next === prev){
                next = Math.floor(Math.random() * pool.length);
            }
            return next;
        });
    };
    const addDefender = (id)=>{
        if (alignmentPlayers.some((p)=>p.id === id)) return;
        setAlignmentPlacements((prev)=>({
                ...prev,
                [formationKey]: [
                    ...alignmentPlayers,
                    {
                        id,
                        x: 50,
                        y: 80
                    }
                ]
            }));
    };
    const moveDefender = (id, x, y)=>{
        setAlignmentPlacements((prev)=>({
                ...prev,
                [formationKey]: alignmentPlayers.map((p)=>p.id === id ? {
                        ...p,
                        x,
                        y
                    } : p)
            }));
    };
    const addOffense = (id)=>{
        if (offenseBuildPlayers.some((p)=>p.id === id)) return;
        const defaultPoint = nearestLandmark(50, 80, offenseLandmarks);
        setOffensePlacements((prev)=>({
                ...prev,
                [formationKey]: [
                    ...offenseBuildPlayers,
                    {
                        id,
                        x: defaultPoint.x,
                        y: defaultPoint.y
                    }
                ]
            }));
    };
    const moveOffense = (id, x, y)=>{
        setOffensePlacements((prev)=>({
                ...prev,
                [formationKey]: offenseBuildPlayers.map((p)=>p.id === id ? {
                        ...p,
                        x,
                        y
                    } : p)
            }));
    };
    const moveEditorPlayer = (id, x, y)=>{
        setEditorOverrides((prev)=>({
                ...prev,
                [formationKey]: {
                    ...displayFormation,
                    ...prev[formationKey],
                    players: displayFormation.players.map((p)=>p.id === id ? {
                            ...p,
                            x,
                            y
                        } : p)
                }
            }));
    };
    const addCustomAlignmentLandmark = ()=>{
        const label = customLandmarkDraft.label.trim();
        if (!label) return;
        const x = clamp(Number(customLandmarkDraft.x || 0), 2, 98);
        const y = clamp(Number(customLandmarkDraft.y || 0), 2, 98);
        if (Number.isNaN(x) || Number.isNaN(y)) return;
        const nextLandmark = {
            id: `custom-${formationKey}-${Date.now()}`,
            x,
            y,
            label,
            layer: customLandmarkDraft.layer
        };
        setCustomAlignmentLandmarks((prev)=>({
                ...prev,
                [formationKey]: [
                    ...prev[formationKey] ?? [],
                    nextLandmark
                ]
            }));
    };
    const removeCustomAlignmentLandmark = (id)=>{
        setCustomAlignmentLandmarks((prev)=>({
                ...prev,
                [formationKey]: (prev[formationKey] ?? []).filter((p)=>p.id !== id)
            }));
    };
    const resetCustomAlignmentLandmarks = ()=>{
        setCustomAlignmentLandmarks((prev)=>({
                ...prev,
                [formationKey]: []
            }));
    };
    const saveEditorChanges = ()=>{
        setEditorOverrides((prev)=>({
                ...prev,
                [formationKey]: {
                    ...displayFormation,
                    ...prev[formationKey],
                    name: editorDraft.name,
                    personnel: editorDraft.personnel,
                    runStrength: editorDraft.runStrength,
                    passStrength: editorDraft.passStrength,
                    backfield: editorDraft.backfield,
                    players: prev[formationKey]?.players ?? displayFormation.players
                }
            }));
    };
    const resetEditorChanges = ()=>{
        setEditorOverrides((prev)=>{
            const next = {
                ...prev
            };
            delete next[formationKey];
            return next;
        });
    };
    const quizResult = {
        formation: normalize(quizAnswers.formation) === normalize(getQuizFormationFamily(displayFormation.name)),
        runStrength: normalizeStrength(quizAnswers.runStrength) === normalize(displayFormation.runStrength),
        passStrength: normalizeStrength(quizAnswers.passStrength) === normalize(displayFormation.passStrength)
    };
    const quizScore = [
        quizResult.formation,
        quizResult.runStrength,
        quizResult.passStrength
    ].filter(Boolean).length;
    const submitQuiz = ()=>{
        setShowQuizFeedback(true);
        setShowQuizAnswers(false);
        const perfect = normalize(quizAnswers.formation) === normalize(getQuizFormationFamily(displayFormation.name)) && normalizeStrength(quizAnswers.runStrength) === normalize(displayFormation.runStrength) && normalizeStrength(quizAnswers.passStrength) === normalize(displayFormation.passStrength);
        setQuizReadyForNext(perfect);
    };
    const correctQuizAnswers = {
        formation: getQuizFormationFamily(displayFormation.name),
        runStrength: FIELD_LABELS[displayFormation.runStrength],
        passStrength: FIELD_LABELS[displayFormation.passStrength]
    };
    const offenseAnswerKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[offenseAnswerKey]": ()=>getOffenseAnswerKeyFromFormation(displayFormation)
    }["FormationRecognitionWorkingApp.useMemo[offenseAnswerKey]"], [
        displayFormation
    ]);
    const offenseCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[offenseCheck]": ()=>getCheckResult(offenseBuildPlayers, offenseAnswerKey, 0.75)
    }["FormationRecognitionWorkingApp.useMemo[offenseCheck]"], [
        offenseBuildPlayers,
        offenseAnswerKey
    ]);
    const alignmentAnswerKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[alignmentAnswerKey]": ()=>{
            return getAlignmentAnswerKey(displayFormation, alignmentLandmarks, frontMode);
        }
    }["FormationRecognitionWorkingApp.useMemo[alignmentAnswerKey]"], [
        displayFormation,
        alignmentLandmarks,
        frontMode
    ]);
    const alignmentCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[alignmentCheck]": ()=>getCheckResult(alignmentPlayers, alignmentAnswerKey, 1.0)
    }["FormationRecognitionWorkingApp.useMemo[alignmentCheck]"], [
        alignmentPlayers,
        alignmentAnswerKey
    ]);
    const alignmentSpecialCases = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormationRecognitionWorkingApp.useMemo[alignmentSpecialCases]": ()=>getAlignmentSpecialCases(displayFormation, frontMode)
    }["FormationRecognitionWorkingApp.useMemo[alignmentSpecialCases]"], [
        displayFormation,
        frontMode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            try {
                const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
                const savedLeaderboard = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
                if (savedUser) setCurrentUser(JSON.parse(savedUser));
                if (savedLeaderboard) setLeaderboard(JSON.parse(savedLeaderboard));
            } catch  {}
        }
    }["FormationRecognitionWorkingApp.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            if (!currentUser) return;
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
            setLeaderboard({
                "FormationRecognitionWorkingApp.useEffect": (prev)=>{
                    const next = [
                        ...prev.filter({
                            "FormationRecognitionWorkingApp.useEffect.next": (entry)=>entry.id !== currentUser.id
                        }["FormationRecognitionWorkingApp.useEffect.next"]),
                        currentUser
                    ].sort({
                        "FormationRecognitionWorkingApp.useEffect.next": (a, b)=>b.stats.totalPoints - a.stats.totalPoints
                    }["FormationRecognitionWorkingApp.useEffect.next"]);
                    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(next));
                    return next;
                }
            }["FormationRecognitionWorkingApp.useEffect"]);
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        currentUser
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            if (!currentUser) return;
            const interval = window.setInterval({
                "FormationRecognitionWorkingApp.useEffect.interval": ()=>{
                    if (document.visibilityState !== "visible") return;
                    setCurrentUser({
                        "FormationRecognitionWorkingApp.useEffect.interval": (prev)=>prev ? {
                                ...prev,
                                stats: {
                                    ...prev.stats,
                                    secondsUsed: prev.stats.secondsUsed + 1
                                }
                            } : prev
                    }["FormationRecognitionWorkingApp.useEffect.interval"]);
                }
            }["FormationRecognitionWorkingApp.useEffect.interval"], 1000);
            return ({
                "FormationRecognitionWorkingApp.useEffect": ()=>window.clearInterval(interval)
            })["FormationRecognitionWorkingApp.useEffect"];
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        currentUser?.id
    ]);
    const loginUser = ()=>{
        const cleanName = loginName.trim();
        const cleanTeamCode = teamCodeInput.trim() || "Foothill";
        if (!cleanName) return;
        const existing = leaderboard.find((entry)=>entry.name.toLowerCase() === cleanName.toLowerCase() && entry.teamCode.toLowerCase() === cleanTeamCode.toLowerCase());
        const nextUser = existing ?? {
            id: `${cleanTeamCode.toLowerCase()}::${cleanName.toLowerCase()}`,
            name: cleanName,
            teamCode: cleanTeamCode,
            stats: {
                ...DEFAULT_STATS,
                quiz: {
                    ...DEFAULT_MODE_STATS
                },
                offense_build: {
                    ...DEFAULT_MODE_STATS
                },
                alignment: {
                    ...DEFAULT_MODE_STATS
                }
            }
        };
        setCurrentUser(nextUser);
    };
    const getSpeedBonus = (activeMode, elapsedMs)=>{
        const seconds = elapsedMs / 1000;
        if (activeMode === "quiz") {
            if (seconds <= 6) return 30;
            if (seconds <= 10) return 20;
            if (seconds <= 15) return 10;
            return 0;
        }
        if (activeMode === "offense_build") {
            if (seconds <= 12) return 30;
            if (seconds <= 20) return 20;
            if (seconds <= 30) return 10;
            return 0;
        }
        if (seconds <= 12) return 30;
        if (seconds <= 20) return 20;
        if (seconds <= 30) return 10;
        return 0;
    };
    const scoreAttempt = (activeMode, accuracy, isCorrect)=>{
        if (!currentUser) return;
        const attemptKey = `${activeMode}::${formationKey}`;
        if (scoredAttemptKey === attemptKey) return;
        const elapsedMs = Math.max(250, Date.now() - attemptStartedAt);
        const accuracyPoints = Math.round(accuracy * 100);
        const speedBonus = activeMode === "alignment" ? 0 : isCorrect ? getSpeedBonus(activeMode, elapsedMs) : 0;
        const totalAward = accuracyPoints + speedBonus;
        setScoredAttemptKey(attemptKey);
        setCurrentUser((prev)=>{
            if (!prev) return prev;
            const currentModeStats = prev.stats[activeMode];
            return {
                ...prev,
                stats: {
                    ...prev.stats,
                    totalPoints: prev.stats.totalPoints + totalAward,
                    [activeMode]: {
                        ...currentModeStats,
                        points: currentModeStats.points + totalAward,
                        attempts: currentModeStats.attempts + 1,
                        correct: currentModeStats.correct + (isCorrect ? 1 : 0),
                        bestTimeMs: isCorrect ? currentModeStats.bestTimeMs === null ? elapsedMs : Math.min(currentModeStats.bestTimeMs, elapsedMs) : currentModeStats.bestTimeMs
                    }
                }
            };
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            if (showQuizFeedback) {
                scoreAttempt("quiz", quizScore / 3, quizScore === 3);
            }
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        showQuizFeedback,
        quizScore,
        formationKey
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            if (showOffenseCheck) {
                const total = Object.keys(offenseAnswerKey).length || 1;
                const wrong = offenseCheck.incorrectIds.length;
                const placedCount = offenseBuildPlayers.length;
                const missing = Math.max(0, total - placedCount);
                const accuracy = Math.max(0, (total - wrong - missing) / total);
                scoreAttempt("offense_build", accuracy, offenseCheck.isCorrect);
            }
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        showOffenseCheck,
        offenseCheck.isCorrect,
        offenseCheck.incorrectIds.length,
        formationKey,
        offenseBuildPlayers.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormationRecognitionWorkingApp.useEffect": ()=>{
            if (showAlignmentCheck) {
                const total = Object.keys(alignmentAnswerKey).length || 1;
                const wrong = alignmentCheck.incorrectIds.length;
                const placedCount = alignmentPlayers.length;
                const missing = Math.max(0, total - placedCount);
                const accuracy = Math.max(0, (total - wrong - missing) / total);
                scoreAttempt("alignment", accuracy, alignmentCheck.isCorrect);
            }
        }
    }["FormationRecognitionWorkingApp.useEffect"], [
        showAlignmentCheck,
        alignmentCheck.isCorrect,
        alignmentCheck.incorrectIds.length,
        formationKey,
        alignmentPlayers.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-100 p-4 md:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-7xl space-y-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "rounded-2xl shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl",
                                        children: getModeTitle(mode)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 2186,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-2",
                                        children: [
                                            currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                className: "rounded-xl",
                                                onClick: ()=>setCurrentUser(null),
                                                children: "Log Out"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2189,
                                                columnNumber: 19
                                            }, this) : null,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-[180px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                    value: mode,
                                                    onValueChange: (value)=>{
                                                        setMode(value);
                                                        setIndex(0);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 2196,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2195,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: MODE_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: option.value,
                                                                    children: option.label
                                                                }, option.value, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2200,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2198,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2194,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2193,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-[220px]",
                                                children: mode === "offense_build" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700",
                                                    children: "Foothill"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2209,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                            className: "cursor-pointer list-none rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700",
                                                            children: [
                                                                "Playbooks: ",
                                                                selectedPlaybooks.length === PLAYBOOK_OPTIONS.length ? "All" : selectedPlaybooks.join(", ")
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2212,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute z-20 mt-2 min-w-[220px] rounded-xl border bg-white p-3 shadow-lg",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-2 flex items-center gap-2 text-sm text-slate-700",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: selectedPlaybooks.length === PLAYBOOK_OPTIONS.length,
                                                                            onChange: (e)=>{
                                                                                setSelectedPlaybooks(e.target.checked ? [
                                                                                    ...PLAYBOOK_OPTIONS
                                                                                ] : [
                                                                                    "Foothill"
                                                                                ]);
                                                                                setIndex(0);
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/page.tsx",
                                                                            lineNumber: 2217,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "All"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2216,
                                                                    columnNumber: 25
                                                                }, this),
                                                                PLAYBOOK_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-2 flex items-center gap-2 text-sm text-slate-700 last:mb-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: selectedPlaybooks.includes(option),
                                                                                onChange: (e)=>{
                                                                                    setSelectedPlaybooks((prev)=>{
                                                                                        const next = e.target.checked ? [
                                                                                            ...prev,
                                                                                            option
                                                                                        ] : prev.filter((p)=>p !== option);
                                                                                        return next.length ? Array.from(new Set(next)) : [
                                                                                            "Foothill"
                                                                                        ];
                                                                                    });
                                                                                    setIndex(0);
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/page.tsx",
                                                                                lineNumber: 2229,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            option
                                                                        ]
                                                                    }, option, true, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 2228,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2215,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2211,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2207,
                                                columnNumber: 17
                                            }, this),
                                            mode === "offense_build" ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-[120px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                    value: personnelFilter,
                                                    onValueChange: (value)=>{
                                                        setPersonnelFilter(value);
                                                        setIndex(0);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 2251,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2250,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: PERSONNEL_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: option,
                                                                    children: option === "Any" ? "Any" : `${option}P`
                                                                }, option, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2255,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2253,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2249,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2248,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                className: "rounded-xl",
                                                onClick: nextCall,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shuffle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shuffle$3e$__["Shuffle"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2264,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Randomize"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2263,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 2187,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 2185,
                                columnNumber: 13
                            }, this),
                            mode !== "quiz" && mode !== "account" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border bg-white p-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl",
                                children: [
                                    displayFormation.name,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500",
                                        children: displayFormation.playbook
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 2272,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 2270,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 2184,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: mode === "account" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "rounded-2xl shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "p-4",
                                        children: currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-3 md:grid-cols-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border bg-white p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2285,
                                                                    columnNumber: 120
                                                                }, this),
                                                                " User"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2285,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-lg font-semibold text-slate-900",
                                                            children: currentUser.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2286,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-slate-500",
                                                            children: [
                                                                "Team: ",
                                                                currentUser.teamCode
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2287,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2284,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border bg-white p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2290,
                                                                    columnNumber: 120
                                                                }, this),
                                                                " Total Points"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2290,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-lg font-semibold text-slate-900",
                                                            children: currentUser.stats.totalPoints
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2291,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-slate-500",
                                                            children: [
                                                                "Quiz ",
                                                                currentUser.stats.quiz.points,
                                                                " • Offense ",
                                                                currentUser.stats.offense_build.points,
                                                                " • Align ",
                                                                currentUser.stats.alignment.points
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2292,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2289,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border bg-white p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock3$3e$__["Clock3"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2295,
                                                                    columnNumber: 120
                                                                }, this),
                                                                " Usage Time"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2295,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-lg font-semibold text-slate-900",
                                                            children: formatDuration(currentUser.stats.secondsUsed)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2296,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-slate-500",
                                                            children: "Tracked while app is open"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2297,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2294,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2283,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-3 md:grid-cols-[1fr_1fr_auto]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Your name",
                                                    value: loginName,
                                                    onChange: (e)=>setLoginName(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2302,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Team code",
                                                    value: teamCodeInput,
                                                    onChange: (e)=>setTeamCodeInput(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2303,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    className: "rounded-xl",
                                                    onClick: loginUser,
                                                    children: "Log In / Create"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2304,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2301,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 2281,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2280,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "rounded-2xl shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            className: "pb-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: "text-lg font-bold text-slate-900",
                                                children: "Mode Leaderboards"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2311,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2310,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "space-y-4",
                                            children: [
                                                "quiz",
                                                "offense_build",
                                                "alignment"
                                            ].map((boardMode)=>{
                                                const title = boardMode === "quiz" ? "Quiz" : boardMode === "offense_build" ? "Offensive" : "Alignment";
                                                const boardEntries = (currentUser ? leaderboard.filter((entry)=>entry.teamCode.toLowerCase() === currentUser.teamCode.toLowerCase()) : leaderboard).sort((a, b)=>b.stats[boardMode].points - a.stats[boardMode].points).slice(0, 5);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm font-semibold text-slate-900",
                                                            children: title
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2325,
                                                            columnNumber: 27
                                                        }, this),
                                                        boardEntries.length ? boardEntries.map((entry, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-semibold text-slate-900",
                                                                                children: [
                                                                                    "#",
                                                                                    idx + 1,
                                                                                    " ",
                                                                                    entry.name
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/page.tsx",
                                                                                lineNumber: 2329,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-slate-500",
                                                                                children: [
                                                                                    entry.stats[boardMode].correct,
                                                                                    "/",
                                                                                    entry.stats[boardMode].attempts,
                                                                                    " correct"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/page.tsx",
                                                                                lineNumber: 2330,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 2328,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-right",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-semibold text-slate-900",
                                                                                children: [
                                                                                    entry.stats[boardMode].points,
                                                                                    " pts"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/page.tsx",
                                                                                lineNumber: 2333,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-slate-500",
                                                                                children: entry.stats[boardMode].bestTimeMs ? `${(entry.stats[boardMode].bestTimeMs / 1000).toFixed(1)}s best` : "—"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/page.tsx",
                                                                                lineNumber: 2334,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 2332,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, `${boardMode}-${entry.id}`, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 2327,
                                                                columnNumber: 29
                                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-slate-500",
                                                            children: "No scores yet."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2337,
                                                            columnNumber: 32
                                                        }, this)
                                                    ]
                                                }, boardMode, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2324,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2313,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2309,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 2279,
                            columnNumber: 15
                        }, this) : mode === "study" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrainingField, {
                                    offensePlayers: displayFormation.players,
                                    overlayLabel: `${displayFormation.playbook} • ${displayFormation.family} • ${displayFormation.personnel}P • Run ${FIELD_LABELS[displayFormation.runStrength]} • Pass ${FIELD_LABELS[displayFormation.passStrength]}`
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2346,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3 md:grid-cols-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            className: "rounded-xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs uppercase tracking-wide text-slate-500",
                                                        children: "Playbook"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2353,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 text-lg font-semibold",
                                                        children: displayFormation.playbook
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2354,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2352,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2351,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            className: "rounded-xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs uppercase tracking-wide text-slate-500",
                                                        children: "Family"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2359,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 text-lg font-semibold",
                                                        children: getQuizFormationFamily(displayFormation.name)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2360,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2358,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2357,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            className: "rounded-xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs uppercase tracking-wide text-slate-500",
                                                        children: "Run Strength"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2365,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 text-lg font-semibold",
                                                        children: FIELD_LABELS[displayFormation.runStrength]
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2366,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2364,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2363,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            className: "rounded-xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs uppercase tracking-wide text-slate-500",
                                                        children: "Pass Strength"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2371,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 text-lg font-semibold",
                                                        children: FIELD_LABELS[displayFormation.passStrength]
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2372,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 2370,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2369,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2350,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true) : mode === "quiz" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrainingField, {
                                            offensePlayers: displayFormation.players
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2380,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 text-base font-bold text-slate-800",
                                                    children: "Your Answers"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2382,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid gap-4 md:grid-cols-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600",
                                                                    children: "Formation"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2385,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    className: "h-12 border-2 border-slate-300 bg-white text-base",
                                                                    placeholder: "Trips, Doubles, B Trey...",
                                                                    value: quizAnswers.formation,
                                                                    onChange: (e)=>setQuizAnswers((prev)=>({
                                                                                ...prev,
                                                                                formation: e.target.value
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2386,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2384,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600",
                                                                    children: "Run Strength"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2389,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    className: "h-12 border-2 border-slate-300 bg-white text-base",
                                                                    placeholder: "Left or Right",
                                                                    value: quizAnswers.runStrength,
                                                                    onChange: (e)=>setQuizAnswers((prev)=>({
                                                                                ...prev,
                                                                                runStrength: e.target.value
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2390,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2388,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600",
                                                                    children: "Pass Strength"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2393,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    className: "h-12 border-2 border-slate-300 bg-white text-base",
                                                                    placeholder: "Left or Right",
                                                                    value: quizAnswers.passStrength,
                                                                    onChange: (e)=>setQuizAnswers((prev)=>({
                                                                                ...prev,
                                                                                passStrength: e.target.value
                                                                            })),
                                                                    onKeyDown: (e)=>{
                                                                        if (e.key === "Enter") {
                                                                            e.preventDefault();
                                                                            if (showQuizFeedback && quizScore === 3 && quizReadyForNext) {
                                                                                nextCall();
                                                                            } else {
                                                                                submitQuiz();
                                                                            }
                                                                        }
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2394,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2392,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2383,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 text-xs text-slate-500",
                                                    children: [
                                                        "Enter only the formation family for Formation. Example: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold text-slate-700",
                                                            children: "B Doubles"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2413,
                                                            columnNumber: 79
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2412,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2381,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2379,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 rounded-2xl border bg-white p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            className: "h-12 w-full rounded-xl text-base",
                                            onClick: submitQuiz,
                                            children: "Check Answers"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2418,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            className: "h-12 w-full rounded-xl text-base",
                                            onClick: ()=>{
                                                setShowQuizAnswers(true);
                                                setShowQuizFeedback(true);
                                                setQuizReadyForNext(false);
                                            },
                                            children: "Show Answers"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2421,
                                            columnNumber: 19
                                        }, this),
                                        showQuizAnswers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "Formation:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2427,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        correctQuizAnswers.formation
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2426,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "Run Strength:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2430,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        correctQuizAnswers.runStrength
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2429,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold",
                                                            children: "Pass Strength:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2433,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        correctQuizAnswers.passStrength
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2432,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2425,
                                            columnNumber: 21
                                        }, this) : null,
                                        showQuizFeedback ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-semibold text-slate-700",
                                                    children: [
                                                        "Score: ",
                                                        quizScore,
                                                        " / 3"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2439,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between rounded-lg border p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Formation"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2441,
                                                                    columnNumber: 98
                                                                }, this),
                                                                quizResult.formation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "h-4 w-4 text-emerald-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2441,
                                                                    columnNumber: 144
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                    className: "h-4 w-4 text-red-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2441,
                                                                    columnNumber: 200
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2441,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between rounded-lg border p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Run Strength"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2442,
                                                                    columnNumber: 98
                                                                }, this),
                                                                quizResult.runStrength ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "h-4 w-4 text-emerald-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2442,
                                                                    columnNumber: 149
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                    className: "h-4 w-4 text-red-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2442,
                                                                    columnNumber: 205
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2442,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between rounded-lg border p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Pass Strength"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2443,
                                                                    columnNumber: 98
                                                                }, this),
                                                                quizResult.passStrength ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "h-4 w-4 text-emerald-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2443,
                                                                    columnNumber: 151
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                    className: "h-4 w-4 text-red-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2443,
                                                                    columnNumber: 207
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2443,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2440,
                                                    columnNumber: 23
                                                }, this),
                                                quizScore === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-center text-sm font-semibold text-emerald-700",
                                                    children: "All 3 correct. Press Enter again for the next formation"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2446,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-dashed p-3 text-sm text-slate-500",
                                            children: [
                                                "Fill in the three answer boxes below the field, then press ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "Check Answers"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2453,
                                                    columnNumber: 82
                                                }, this),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2452,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2417,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 2378,
                            columnNumber: 15
                        }, this) : mode === "alignment" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 lg:grid-cols-[1fr_320px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap justify-end gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-[110px]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                        value: frontMode,
                                                        onValueChange: (value)=>setFrontMode(value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2465,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 2464,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "4-3",
                                                                        children: "4-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 2468,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "4-4",
                                                                        children: "4-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.tsx",
                                                                        lineNumber: 2469,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.tsx",
                                                                lineNumber: 2467,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 2463,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2462,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "outline",
                                                    className: "rounded-xl",
                                                    onClick: ()=>setEnhancedLandmarks((p)=>!p),
                                                    children: "Toggle Landmark Visibility"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2473,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2461,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrainingField, {
                                            offensePlayers: displayFormation.players,
                                            defensePlayers: alignmentPlayers,
                                            defenseLandmarks: alignmentLandmarks,
                                            enhancedLandmarks: enhancedLandmarks,
                                            editableDefense: true,
                                            incorrectDefenseIds: showAlignmentCheck ? alignmentCheck.incorrectIds : [],
                                            defenseGhosts: showAlignmentCheck ? alignmentCheck.ghosts : [],
                                            overlayLabel: "Drag defenders to the defensive landmarks.",
                                            onMoveDefense: moveDefender
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2477,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2460,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenTray, {
                                            title: "Defender Tray",
                                            ids: remainingDefenders,
                                            onAdd: addDefender
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2490,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        "Drag defenders to the defensive landmarks. Front: ",
                                                        frontMode
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2492,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            className: "rounded-xl",
                                                            onClick: ()=>setShowAlignmentCheck(true),
                                                            children: "Check"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2494,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "outline",
                                                            className: "rounded-xl",
                                                            onClick: ()=>setShowAlignmentCheck(false),
                                                            children: "Hide Answers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2495,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2493,
                                                    columnNumber: 21
                                                }, this),
                                                showAlignmentCheck ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: "Wrong defenders are highlighted in red. Dashed circles show answer-key spots."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2499,
                                                            columnNumber: 25
                                                        }, this),
                                                        alignmentCheck.isCorrect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "h-5 w-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2502,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " Correct Alignment"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2501,
                                                            columnNumber: 27
                                                        }, this) : null,
                                                        alignmentSpecialCases.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-2 font-semibold",
                                                                    children: "Special-case feedback"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2507,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: alignmentSpecialCases.map((note, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                "• ",
                                                                                note
                                                                            ]
                                                                        }, idx, true, {
                                                                            fileName: "[project]/app/page.tsx",
                                                                            lineNumber: 2510,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2508,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2506,
                                                            columnNumber: 27
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2498,
                                                    columnNumber: 23
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2491,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2489,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 2459,
                            columnNumber: 15
                        }, this) : mode === "editor" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 lg:grid-cols-[1fr_360px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrainingField, {
                                    offensePlayers: displayFormation.players,
                                    editableOffense: true,
                                    lockedOffenseIds: [],
                                    onMoveOffense: moveEditorPlayer,
                                    overlayLabel: "Drag any player to edit the formation. Use Save to keep your changes."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2522,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-2xl border bg-white p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3 text-sm font-semibold text-slate-700",
                                                    children: "Formation Info"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2531,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2534,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    value: editorDraft.name,
                                                                    onChange: (e)=>setEditorDraft((prev)=>({
                                                                                ...prev,
                                                                                name: e.target.value
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2535,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2533,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Personnel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2538,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    value: editorDraft.personnel,
                                                                    onChange: (e)=>setEditorDraft((prev)=>({
                                                                                ...prev,
                                                                                personnel: e.target.value
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2539,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2537,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                            children: "Run Strength"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/page.tsx",
                                                                            lineNumber: 2543,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                                            value: editorDraft.runStrength,
                                                                            onValueChange: (value)=>setEditorDraft((prev)=>({
                                                                                        ...prev,
                                                                                        runStrength: value
                                                                                    })),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                                        fileName: "[project]/app/page.tsx",
                                                                                        lineNumber: 2546,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/page.tsx",
                                                                                    lineNumber: 2545,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                            value: "left",
                                                                                            children: "Left"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/page.tsx",
                                                                                            lineNumber: 2549,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                            value: "right",
                                                                                            children: "Right"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/page.tsx",
                                                                                            lineNumber: 2550,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/page.tsx",
                                                                                    lineNumber: 2548,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/page.tsx",
                                                                            lineNumber: 2544,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2542,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                            children: "Pass Strength"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/page.tsx",
                                                                            lineNumber: 2555,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                                            value: editorDraft.passStrength,
                                                                            onValueChange: (value)=>setEditorDraft((prev)=>({
                                                                                        ...prev,
                                                                                        passStrength: value
                                                                                    })),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                                        fileName: "[project]/app/page.tsx",
                                                                                        lineNumber: 2558,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/page.tsx",
                                                                                    lineNumber: 2557,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                            value: "left",
                                                                                            children: "Left"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/page.tsx",
                                                                                            lineNumber: 2561,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                            value: "right",
                                                                                            children: "Right"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/page.tsx",
                                                                                            lineNumber: 2562,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/page.tsx",
                                                                                    lineNumber: 2560,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/page.tsx",
                                                                            lineNumber: 2556,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2554,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2541,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                    children: "Backfield"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2568,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    value: editorDraft.backfield,
                                                                    onChange: (e)=>setEditorDraft((prev)=>({
                                                                                ...prev,
                                                                                backfield: e.target.value
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2569,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2567,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2532,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2530,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-2xl border bg-white p-4 text-sm text-slate-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            className: "rounded-xl",
                                                            onClick: saveEditorChanges,
                                                            children: "Save"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2575,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "outline",
                                                            className: "rounded-xl",
                                                            onClick: resetEditorChanges,
                                                            children: "Reset"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2576,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2574,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3",
                                                    children: "This editor updates the current formation's saved name, personnel, strengths, backfield, and player locations."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2578,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2573,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2529,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 2521,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 lg:grid-cols-[1fr_320px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrainingField, {
                                    offensePlayers: [
                                        ...baseLine(false),
                                        ...offenseBuildPlayers
                                    ],
                                    offenseLandmarks: offenseLandmarks,
                                    offenseGhostOffset: showOffenseCheck ? 1.6 : 0,
                                    dimOffenseOnAnswers: showOffenseCheck,
                                    editableOffense: true,
                                    flipOffense: true,
                                    onMoveOffense: moveOffense,
                                    incorrectOffenseIds: showOffenseCheck ? offenseCheck.incorrectIds : [],
                                    offenseGhosts: showOffenseCheck ? offenseCheck.ghosts : [],
                                    overlayLabel: "Drag QB, RB, X, Y, H, Z to the offensive landmarks."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2584,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenTray, {
                                            title: "Offense Tray",
                                            ids: remainingOffense,
                                            onAdd: addOffense
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2597,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: "Drag offensive pieces to the shared landmark grid."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2599,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            className: "rounded-xl",
                                                            onClick: ()=>setShowOffenseCheck(true),
                                                            children: "Check"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2601,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "outline",
                                                            className: "rounded-xl",
                                                            onClick: ()=>setShowOffenseCheck(false),
                                                            children: "Hide Answers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2602,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2600,
                                                    columnNumber: 21
                                                }, this),
                                                showOffenseCheck ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: "Wrong players are highlighted in red. Dashed circles show the correct spots."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2606,
                                                            columnNumber: 25
                                                        }, this),
                                                        offenseCheck.isCorrect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "h-5 w-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.tsx",
                                                                    lineNumber: 2609,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " Correct Formation"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 2608,
                                                            columnNumber: 27
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 2605,
                                                    columnNumber: 23
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 2598,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 2596,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 2583,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 2277,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 2183,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 2182,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 2181,
        columnNumber: 5
    }, this);
}
_s1(FormationRecognitionWorkingApp, "zjZsBrqVsGffGbJujJZooEqzmpQ=");
_c3 = FormationRecognitionWorkingApp;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Circle");
__turbopack_context__.k.register(_c1, "TrainingField");
__turbopack_context__.k.register(_c2, "TokenTray");
__turbopack_context__.k.register(_c3, "FormationRecognitionWorkingApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0r9mb8i._.js.map