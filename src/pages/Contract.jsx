import React, { useState, useEffect } from "react";
import { Check, Shield, ArrowRight, AlertCircle, Info } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { trackEvent, captureError } from "../analytics";
import { PLANS } from "../constants/plans";

const Contract = () => {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("discord_user");
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });

  const [consentDisplay, setConsentDisplay] = useState(true);
  const [consentRoles, setConsentRoles] = useState(true);
  const [consentTerms, setConsentTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oauthRedirecting, setOauthRedirecting] = useState(false);

  const appBaseUrl =
    import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const redirectUriClient =
    import.meta.env.VITE_DISCORD_REDIRECT_URI || `${appBaseUrl}/auth/callback`;

  // OAuth callback handling
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    // prevent duplicate calls
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    const cleanUrl = url.toString();
    window.history.replaceState({}, "", cleanUrl);

    (async () => {
      try {
        const res = await fetch("/discord-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!res.ok) {
          const text = await res.text();
          captureError(new Error("OAuth exchange failed"), { text, status: res.status });
          if (res.status === 401) {
            setError("認証に失敗しました。メンバーシップページへ戻ります。");
            setTimeout(() => {
              window.location.href = "/membership";
            }, 1800);
          } else {
            setError("認証に失敗しました。もう一度お試しください。");
          }
          return;
        }
        const data = await res.json();
        if (data.user?.id) {
          const discordUser = {
            id: data.user.id,
            name: data.user.username,
            discriminator: data.user.discriminator,
            avatar: data.user.avatar
              ? `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`
              : null,
          };
          localStorage.setItem("discord_user", JSON.stringify(discordUser));
          setUser(discordUser);
          trackEvent("login_success", { provider: "discord", context: "contract" });
        }
      } catch (err) {
        captureError(err, { stage: "oauth_callback_contract" });
        setError("認証中にエラーが発生しました。");
      }
    })();
  }, []);

  const beginDiscordLogin = () => {
    trackEvent("login_start", { provider: "discord", context: "contract" });
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
      response_type: "code",
      scope: "identify guilds.join",
      redirect_uri: redirectUriClient,
      prompt: "consent",
      state: returnTo || "/membership",
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  // Login check
  useEffect(() => {
    if (!planParam) {
      window.location.replace("/membership");
      return;
    }

    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) return;

    if (!user) {
      const timer = setTimeout(() => {
        beginDiscordLogin();
        setOauthRedirecting(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!user || !planParam || !consentTerms) return;
    
    setLoading(true);
    trackEvent("checkout_start", { priceType: planParam });

    try {
      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceType: planParam,
          discord_user_id: user.id,
          consent_display: consentDisplay,
          consent_roles: consentRoles,
          consent_terms: consentTerms,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        captureError(new Error("Checkout create failed"), { priceType: planParam, text });
        setError("決済セッションの作成に失敗しました。");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      captureError(err, { stage: "checkout_start_contract", priceType: planParam });
      setError("ネットワークエラーが発生しました。");
      setLoading(false);
    }
  };

  const planInfo = PLANS[planParam] || null;
  const getPlanName = (p) => PLANS[p]?.label ? `${PLANS[p].label} Plan` : "Unknown Plan";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
        <div className="text-center space-y-3">
          {error ? (
            <>
              <div className="text-red-600 font-black text-lg">{error}</div>
              <div className="text-sm text-slate-500">数秒後に /membership へ戻ります。</div>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fbb4e] mx-auto mb-4"></div>
              <p className="text-slate-600 font-bold">
                {oauthRedirecting ? "Discord 認証へ移動しています..." : "ページを準備しています..."}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
      `}</style>
      <main className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 text-center">
          支援手続きの確認
        </h1>
        <p className="text-center text-sm text-slate-600 mb-10">
          支援者表示への同意と、Discord ロール付与の可否を選択したうえで、Stripe 決済へ進みます。
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={20} />
            <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Selected Plan
                </div>
                <div className="text-xl font-black text-slate-800 brand-font">
                  {getPlanName(planParam)}
                </div>
                {planInfo && (
                  <div className="text-sm text-slate-600 mt-1">
                    ￥{planInfo.price.toLocaleString()} / {planInfo.unit}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={
                    user.avatar ||
                    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"
                  }
                  className="w-10 h-10 rounded-full shadow-sm"
                  alt=""
                />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-slate-700">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    #{user.discriminator} としてログイン中
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleRow
              title="利用規約に同意する"
              desc="Stripe 決済の前に利用規約へ同意してください。"
              checked={consentTerms}
              onChange={() => setConsentTerms(!consentTerms)}
              required
              linkLabel="利用規約を開く"
              linkHref="/legal"
            />
            <ToggleRow
              title="支援者として名前を表示する（任意）"
              desc="支援者一覧やサーバー内でのクレジット表記に Discord 名を利用します。オフにすると匿名表示になります。"
              checked={consentDisplay}
              onChange={() => setConsentDisplay(!consentDisplay)}
            />
            <ToggleRow
              title="支援ロールを自動付与する（任意）"
              desc="決済完了後、自動的にサポーターロールを付与し、特典チャンネルへアクセス可能にします。"
              checked={consentRoles}
              onChange={() => setConsentRoles(!consentRoles)}
            />
          </div>

          {!consentDisplay && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Info size={14} className="text-slate-400" />
              <span>支援者一覧では「匿名」として表示されます。</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            <div className="font-bold text-slate-800 mb-2">次のステップ</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>上記の同意内容を確認する（利用規約は必須）</li>
              <li>Stripe へ遷移して決済情報を入力する</li>
              <li>決済完了後、自動的に Discord ロールが付与されます</li>
            </ol>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleCheckout}
              disabled={loading || !planParam || !consentTerms}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
                consentTerms && !loading && planParam
                  ? "bg-[#5fbb4e] text-white hover:bg-[#4a9a3d] shadow-[0_4px_0_#469e38] active:shadow-none active:translate-y-[4px]"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Shield size={20} />
                  Stripe で決済する
                </>
              )}
            </button>
            <a
              href="/membership"
              className="md:w-48 w-full text-center py-4 rounded-2xl font-bold text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              戻る・キャンセル
            </a>
          </div>

          <div className="text-center">
            <a
              href="/help"
              className="text-sm font-bold text-[#5865F2] hover:underline"
            >
              ヘルプ・FAQを見る
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

const ToggleRow = ({ title, desc, checked, onChange, required = false, linkLabel, linkHref }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div
      className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center transition-colors ${
        checked ? "bg-[#5fbb4e] border-[#4a9a3d]" : "bg-white border-slate-300 group-hover:border-[#5fbb4e]"
      }`}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
    >
      {checked && <Check size={16} className="text-white" />}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <div className="font-bold text-slate-800 group-hover:text-[#5fbb4e] transition-colors">{title}</div>
        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            required ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {required ? "必須" : "任意"}
        </span>
      </div>
      <div className="text-sm text-slate-600 leading-relaxed">{desc}</div>
      {linkLabel && linkHref && (
        <a
          href={linkHref}
          className="text-xs font-bold text-[#5865F2] hover:underline inline-flex items-center gap-1 mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {linkLabel} <ArrowRight size={14} />
        </a>
      )}
    </div>
  </label>
);

export default Contract;
