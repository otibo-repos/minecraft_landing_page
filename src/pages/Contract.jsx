import React, { useState, useEffect } from "react";
import { Check, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { trackEvent, captureError } from "../analytics";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          captureError(new Error("OAuth exchange failed"), { text });
          setError("認証に失敗しました。もう一度お試しください。");
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
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
      response_type: "code",
      scope: "identify guilds.join",
      redirect_uri: redirectUriClient,
      prompt: "consent",
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  // Login check
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) return;

    if (!user) {
      const timer = setTimeout(() => {
        beginDiscordLogin();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!user || !planParam) return;
    
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

  const getPlanName = (p) => {
    switch (p) {
      case "one_month": return "Ticket Plan (1回)";
      case "sub_monthly": return "Monthly Plan (月額)";
      case "sub_yearly": return "Yearly Plan (年額)";
      default: return "Unknown Plan";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fbb4e] mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Discord 認証へ移動しています...</p>
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
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Selected Plan</div>
            <div className="text-xl font-black text-slate-800 brand-font">
              {getPlanName(planParam)}
            </div>
            <div className="flex items-center gap-2 mt-2">
               <img
                src={user.avatar || "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"}
                className="w-6 h-6 rounded-full"
                alt=""
              />
              <span className="text-sm font-bold text-slate-600">
                {user.name} <span className="text-slate-400">#{user.discriminator}</span> としてログイン中
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleRow
              title="支援者として名前を表示する"
              desc="支援者一覧やサーバー内でのクレジット表記に Discord 名を利用します。"
              checked={consentDisplay}
              onChange={() => setConsentDisplay(!consentDisplay)}
            />
            <ToggleRow
              title="支援ロールを自動付与する"
              desc="決済完了後、自動的にサポーターロールを付与し、特典チャンネルへアクセス可能にします。"
              checked={consentRoles}
              onChange={() => setConsentRoles(!consentRoles)}
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            <div className="font-bold text-slate-800 mb-2">次のステップ</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>上記の同意内容を確認する</li>
              <li>Stripe へ遷移して決済情報を入力する</li>
              <li>決済完了後、自動的に Discord ロールが付与されます</li>
            </ol>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!consentRoles || loading || !planParam}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
              consentRoles && !loading && planParam
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
          {!planParam && (
             <p className="text-center text-xs text-red-400 font-bold">
               プランが選択されていません。トップページからやり直してください。
             </p>
          )}
        </div>
      </main>
    </div>
  );
};

const ToggleRow = ({ title, desc, checked, onChange }) => (
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
      <div className="font-bold text-slate-800 group-hover:text-[#5fbb4e] transition-colors">{title}</div>
      <div className="text-sm text-slate-600 leading-relaxed">{desc}</div>
    </div>
  </label>
);

export default Contract;
