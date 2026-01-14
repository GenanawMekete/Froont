export function getTelegramUser() {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();

    return {
      isTelegram: true,
      user: tg.initDataUnsafe?.user || null,
      initData: tg.initData
    };
  }

  // Browser fallback
  return {
    isTelegram: false,
    user: {
      id: 0,
      username: "guest",
      first_name: "Guest"
    },
    initData: null
  };
}