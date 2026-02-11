import { useState, type FormEvent } from "react"
import { useAuthStore } from "@/app/store/auth-store"
import { ThemeProvider, useTheme } from "@/app/components/theme-provider"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Separator } from "@/app/components/ui/separator"
import { Toaster, toast } from "sonner"
import { Mail, Lock, Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react"
import { FaGoogle, FaYandex, FaTelegramPlane } from "react-icons/fa"
import { PwLogo } from "@/app/components/pw-logo"

// --- Login Form ---

function LoginForm() {
  const { login, loginWithProvider, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { theme, setTheme } = useTheme()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(email || "admin@profitableweb.ru", password || "demo")
    } catch {
      toast.error("Ошибка входа")
    }
  }

  const handleOAuth = async (provider: "google" | "yandex" | "telegram") => {
    try {
      await loginWithProvider(provider)
    } catch {
      toast.error("Ошибка авторизации")
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="space-y-0 pb-6">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex justify-center">
                <PwLogo size="2xl" accentClass="fill-[#5ADC5A]" />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@profitableweb.ru"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Запомнить меня
                  </label>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    "Войти"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                  или
                </span>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuth("google")}
                  disabled={isLoading}
                >
                  <FaGoogle className="h-4 w-4" />
                  <span className="sr-only">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuth("yandex")}
                  disabled={isLoading}
                >
                  <FaYandex className="h-4 w-4" />
                  <span className="sr-only">Яндекс</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuth("telegram")}
                  disabled={isLoading}
                >
                  <FaTelegramPlane className="h-4 w-4" />
                  <span className="sr-only">Telegram</span>
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

// --- Exported wrapper with ThemeProvider ---

export function LoginPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LoginForm />
    </ThemeProvider>
  )
}
