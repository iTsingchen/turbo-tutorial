## 多页面应用模式
针对 `src/index.{ts|tsx|js|jsx|json}` 扩展名进行区分：
- 单页面模式：`ts|tsx|js|jsx`
- 多页面模式：`json`

### 多页面模式
定义形如：
```json
{
  "home": "./pages/home.tsx", // This is must field
  "about": "./pages/about.tsx",
  "support": "./pages/support.tsx"
}
```

多页面模式必须包含 `home` 字段，作为访问的入口，例如：`http://localhost:3000` 将会访问 `home` 页面。
其他字段会生成相应的 Page，例如：
- about: `http://localhost:3000/about`
- support: `http://localhost:3000/support`

当只有一个 `home` 字段时，与单页面模式相同。
