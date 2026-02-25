import React, { useState } from "react";
import {
  Gamepad2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  History,
  Clock,
  XCircle,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";

const GAMES = [
  {
    id: "fcmobile",
    name: "FC Mobile VN",
    icon: "⚽",
    color: "from-red-500 to-red-700",
  },
  {
    id: "lienquan",
    name: "Liên Quân Mobile",
    icon: "⚔️",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "freefire",
    name: "Free Fire",
    icon: "🔥",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "deltaforce",
    name: "Delta Force",
    icon: "🪖",
    color: "from-gray-600 to-gray-800",
  },
  {
    id: "napso",
    name: "Nạp Sò",
    icon: "🐚",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "fconline",
    name: "FC Online (VN)",
    icon: "⚽",
    color: "from-green-500 to-green-700",
  },
  {
    id: "fconlinem",
    name: "FC Online M (VN)",
    icon: "📱",
    color: "from-teal-500 to-teal-700",
  },
  {
    id: "caithe",
    name: "Cái thế tranh hùng",
    icon: "🗡️",
    color: "from-red-600 to-red-800",
  },
];

const PACKAGES = {
  fcmobile: [
    { id: "fc1", name: "100 FC Points", price: 20000, originalPrice: 25000 },
    { id: "fc2", name: "250 FC Points", price: 50000, originalPrice: 60000 },
    { id: "fc3", name: "500 FC Points", price: 100000, originalPrice: 120000 },
  ],
  lienquan: [
    { id: "lq1", name: "40 Quân Huy", price: 20000, originalPrice: 25000 },
    { id: "lq2", name: "105 Quân Huy", price: 50000, originalPrice: 60000 },
    { id: "lq3", name: "210 Quân Huy", price: 100000, originalPrice: 120000 },
    { id: "lq4", name: "425 Quân Huy", price: 200000, originalPrice: 250000 },
  ],
  freefire: [
    { id: "ff1", name: "111 Kim Cương", price: 20000, originalPrice: 25000 },
    { id: "ff2", name: "280 Kim Cương", price: 50000, originalPrice: 60000 },
    { id: "ff3", name: "580 Kim Cương", price: 100000, originalPrice: 120000 },
    { id: "ff4", name: "1180 Kim Cương", price: 200000, originalPrice: 250000 },
  ],
  deltaforce: [
    { id: "df1", name: "60 CP", price: 20000, originalPrice: 25000 },
    { id: "df2", name: "300 CP", price: 100000, originalPrice: 120000 },
    { id: "df3", name: "680 CP", price: 200000, originalPrice: 250000 },
  ],
  napso: [
    { id: "ns1", name: "40 Sò", price: 20000, originalPrice: 20000 },
    { id: "ns2", name: "100 Sò", price: 50000, originalPrice: 50000 },
    { id: "ns3", name: "200 Sò", price: 100000, originalPrice: 100000 },
  ],
  fconline: [
    { id: "fco1", name: "100 FC", price: 20000, originalPrice: 25000 },
    { id: "fco2", name: "250 FC", price: 50000, originalPrice: 60000 },
    { id: "fco3", name: "500 FC", price: 100000, originalPrice: 120000 },
  ],
  fconlinem: [
    { id: "fcom1", name: "100 MC", price: 20000, originalPrice: 25000 },
    { id: "fcom2", name: "250 MC", price: 50000, originalPrice: 60000 },
    { id: "fcom3", name: "500 MC", price: 100000, originalPrice: 120000 },
  ],
  caithe: [
    { id: "ct1", name: "60 KNB", price: 20000, originalPrice: 25000 },
    { id: "ct2", name: "300 KNB", price: 100000, originalPrice: 120000 },
    { id: "ct3", name: "680 KNB", price: 200000, originalPrice: 250000 },
  ],
};

export function GameTopup() {
  const { notify } = useNotification();
  const { requestDeposit, transactions, user } = useAppContext();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [gameId, setGameId] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const depositHistory = transactions.filter(t => t.type === 'topup');

  const handleNextStep = () => {
    if (step === 1 && !selectedGame) {
      notify("Vui lòng chọn game cần nạp", "error");
      return;
    }
    if (step === 2) {
      if (!selectedPackage) {
        notify("Vui lòng chọn gói nạp", "error");
        return;
      }
      if (!gameId) {
        notify("Vui lòng nhập ID Game / Tên nhân vật", "error");
        return;
      }
    }
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleConfirmPayment = () => {
    if (selectedPackage && selectedGame) {
      const gameName = GAMES.find(g => g.id === selectedGame)?.name || selectedGame;
      requestDeposit(selectedPackage.price, gameName, selectedPackage.name, gameId);
      notify("Đã xác nhận thanh toán. Hệ thống đang xử lý...", "success");
      setTimeout(() => {
        setStep(1);
        setSelectedGame(null);
        setSelectedPackage(null);
        setGameId("");
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Gamepad2 className="w-8 h-8" /> Nạp Game Giá Rẻ
        </h1>
        <p className="text-blue-100 max-w-2xl">
          Nạp game tự động 24/7 qua chuyển khoản ngân hàng. Chiết khấu cao, an
          toàn và nhanh chóng.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[
          { num: 1, label: "Chọn Game" },
          { num: 2, label: "Chọn Gói & Nhập ID" },
          { num: 3, label: "Thanh Toán" },
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div
              className={`flex flex-col items-center gap-2 ${step >= s.num ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${
                  step >= s.num
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`flex-1 h-1 mx-4 rounded-full ${step > idx + 1 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Chọn game cần nạp</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GAMES.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedGame === game.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl shadow-inner`}
                    >
                      {game.icon}
                    </div>
                    <div className="font-bold text-lg">{game.name}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                Tiếp tục <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && selectedGame && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">
                Nhập thông tin tài khoản
              </h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium mb-2">
                  ID Game / Tên nhân vật
                </label>
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="Nhập chính xác ID Game của bạn"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Vui lòng kiểm tra kỹ ID
                  trước khi nạp
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Chọn gói nạp</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(PACKAGES as any)[selectedGame].map((pkg: any) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPackage?.id === pkg.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">{pkg.name}</div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {pkg.price.toLocaleString()}đ
                      </span>
                      <span className="text-sm text-gray-500 line-through mb-1">
                        {pkg.originalPrice.toLocaleString()}đ
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                Thanh toán <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedPackage && (
          <div className="space-y-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-4">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Game:
                  </span>
                  <span className="font-medium">
                    {GAMES.find((g) => g.id === selectedGame)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Gói nạp:
                  </span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    ID Game:
                  </span>
                  <span className="font-medium">{gameId}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                  <span className="text-gray-600 dark:text-gray-400 font-bold">
                    Tổng thanh toán:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                    {selectedPackage.price.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Chuyển khoản ngân hàng
              </h3>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  <img
                    src="https://images.unsplash.com/photo-1621360841013-c7683cfa9f06?auto=format&fit=crop&q=80&w=200&h=200"
                    alt="QR Code"
                    className="w-full h-full object-contain p-2 rounded-xl"
                    style={{ content: `url('https://img.vietqr.io/image/970436-9337117930-compact2.png?amount=${selectedPackage.price}&addInfo=NAPGAME%20${gameId}&accountName=HOANG%20MAI%20ANH%20VU')` }}
                  />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="p-4 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-sm text-gray-500 mb-1">Ngân hàng</div>
                    <div className="font-bold">
                      Vietcombank (VCB Digibank)
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Số tài khoản
                      </div>
                      <div className="font-bold text-lg">9337117930</div>
                    </div>
                    <button
                      className="text-blue-600 text-sm font-medium hover:underline"
                      onClick={() => {
                        navigator.clipboard.writeText("9337117930");
                        notify("Đã copy số tài khoản", "success");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Nội dung chuyển khoản
                      </div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        NAPGAME {gameId}
                      </div>
                    </div>
                    <button
                      className="text-blue-600 text-sm font-medium hover:underline"
                      onClick={() => {
                        navigator.clipboard.writeText(`NAPGAME ${gameId}`);
                        notify("Đã copy nội dung", "success");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  Vui lòng chuyển đúng số tiền và nội dung. Hệ thống sẽ tự động
                  nạp game cho bạn trong vòng 1-3 phút sau khi nhận được tiền.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Tôi đã chuyển khoản
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lịch sử nạp tiền */}
      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-lg">Lịch sử nạp tiền</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {depositHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có lịch sử nạp tiền.
            </div>
          ) : (
            depositHistory.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === 'success' ? 'bg-green-100 text-green-600' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                     item.status === 'pending' ? <Clock className="w-5 h-5" /> : 
                     <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{item.amount.toLocaleString()}đ</div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                    item.status === 'success' ? 'bg-green-100 text-green-700' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'success' ? 'Thành công' : 
                     item.status === 'pending' ? 'Đang xử lý' : 
                     'Bị từ chối'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
