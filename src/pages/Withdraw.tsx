import React, { useState } from "react";
import {
  Wallet,
  Building2,
  CreditCard,
  ArrowRight,
  Gamepad2,
  Hash,
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAppContext } from "../contexts/AppContext";

const BANKS = [
  { id: "vcb", name: "Vietcombank" },
  { id: "tcb", name: "Techcombank" },
  { id: "mb", name: "MB Bank" },
  { id: "vtb", name: "VietinBank" },
  { id: "bidv", name: "BIDV" },
  { id: "agribank", name: "Agribank" },
  { id: "acb", name: "ACB" },
  { id: "sacombank", name: "Sacombank" },
  { id: "vpbank", name: "VPBank" },
  { id: "tpbank", name: "TPBank" },
  { id: "vib", name: "VIB" },
  { id: "hdbank", name: "HDBank" },
  { id: "shb", name: "SHB" },
  { id: "seabank", name: "SeABank" },
  { id: "msb", name: "MSB" },
  { id: "lpb", name: "LienVietPostBank" },
  { id: "eximbank", name: "Eximbank" },
  { id: "ocb", name: "OCB" },
  { id: "namabank", name: "Nam A Bank" },
  { id: "kienlongbank", name: "Kienlongbank" },
  { id: "vietabank", name: "VietABank" },
  { id: "ncb", name: "NCB" },
  { id: "bacabank", name: "Bac A Bank" },
  { id: "dongabank", name: "DongA Bank" },
  { id: "scb", name: "SCB" },
  { id: "oceanbank", name: "OceanBank" },
  { id: "gpbank", name: "GPBank" },
  { id: "cbbank", name: "CBBank" },
  { id: "baovietbank", name: "BaoViet Bank" },
  { id: "saigonbank", name: "Saigonbank" },
  { id: "pgbank", name: "PG Bank" },
  { id: "vrb", name: "VRB" },
];

const GAME_CARDS = [
  { id: "garena", name: "Thẻ Garena" },
  { id: "kimcuong", name: "Kim cương (Free Fire)" },
  { id: "quanhuy", name: "Quân huy (Liên Quân)" },
];

const CARD_VALUES = [
  { value: 50000, label: "50,000đ" },
  { value: 100000, label: "100,000đ" },
  { value: 200000, label: "200,000đ" },
  { value: 500000, label: "500,000đ" },
];

export function Withdraw() {
  const { notify } = useNotification();
  const { balance, requestWithdrawal, transactions } = useAppContext();
  const [withdrawMethod, setWithdrawMethod] = useState<"bank" | "card">("bank");

  // Bank State
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");

  // Game Card State
  const [gameCardType, setGameCardType] = useState("");
  const [cardValue, setCardValue] = useState("");
  const [cardQuantity, setCardQuantity] = useState("1");

  const handleWithdrawBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !bank || !account) {
      notify("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }
    if (parseInt(amount) < 50000) {
      notify("Số tiền rút tối thiểu là 50,000đ", "error");
      return;
    }
    
    const success = requestWithdrawal(parseInt(amount), bank, account);
    if (!success) {
      notify("Số dư không đủ", "error");
      return;
    }

    notify(
      "Đã gửi yêu cầu rút tiền thành công. Vui lòng chờ duyệt.",
      "success",
    );
    setAmount("");
    setBank("");
    setAccount("");
  };

  const handleWithdrawGameCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCardType || !cardValue || !cardQuantity) {
      notify("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }
    const totalValue = parseInt(cardValue) * parseInt(cardQuantity);
    
    const success = requestWithdrawal(totalValue, "Thẻ Game", gameCardType);
    if (!success) {
      notify("Số dư không đủ để đổi thẻ", "error");
      return;
    }

    notify(
      "Đã gửi yêu cầu đổi thẻ thành công. Mã thẻ sẽ được gửi vào email của bạn.",
      "success",
    );
    setGameCardType("");
    setCardValue("");
    setCardQuantity("1");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white p-6 rounded-2xl text-white dark:text-black shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 dark:bg-black/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="text-white/80 dark:text-black/80 text-sm font-medium mb-2">
                Số dư khả dụng
              </div>
              <div className="text-4xl font-bold tracking-tight mb-6">{balance.toLocaleString()}đ</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 dark:text-black/60">
                  Tối thiểu rút: 50,000đ
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold mb-4">Lịch sử rút tiền</h3>
            <div className="space-y-4">
              {transactions.filter(t => t.type === 'withdraw').length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Chưa có lịch sử rút tiền.
                </div>
              ) : (
                transactions.filter(t => t.type === 'withdraw').map(tx => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{tx.title}</div>
                      <div className="text-gray-500 text-xs">{tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-500">{tx.amount.toLocaleString()}đ</div>
                      <div className={`text-xs font-medium ${tx.status === 'success' ? 'text-green-500' : tx.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                        {tx.status === 'success' ? 'Thành công' : tx.status === 'rejected' ? 'Từ chối' : 'Đang xử lý'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-black p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Tạo lệnh rút tiền</h2>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 dark:bg-black rounded-xl mb-8">
              <button
                onClick={() => setWithdrawMethod("bank")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  withdrawMethod === "bank"
                    ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4" /> Rút về Ngân hàng
              </button>
              <button
                onClick={() => setWithdrawMethod("card")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  withdrawMethod === "card"
                    ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                <Gamepad2 className="w-4 h-4" /> Đổi Thẻ GAME
              </button>
            </div>

            {withdrawMethod === "bank" ? (
              <form onSubmit={handleWithdrawBank} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Ngân hàng thụ hưởng
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none"
                    >
                      <option value="">Chọn ngân hàng</option>
                      {BANKS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Số tài khoản
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="Nhập số tài khoản"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Số tiền cần rút
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="VD: 100000"
                      className="w-full pl-12 pr-16 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono text-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                      VNĐ
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Rút tiền ngay <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleWithdrawGameCard} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Loại thẻ{" "}
                    <span className="text-xs text-green-600 dark:text-green-400 font-normal">
                      (sạch từ napthe.vn)
                    </span>
                  </label>
                  <div className="relative">
                    <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={gameCardType}
                      onChange={(e) => setGameCardType(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none"
                    >
                      <option value="">Chọn loại thẻ</option>
                      {GAME_CARDS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Mệnh giá thẻ
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={cardValue}
                      onChange={(e) => setCardValue(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none"
                    >
                      <option value="">Chọn mệnh giá</option>
                      {CARD_VALUES.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Số lượng</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={cardQuantity}
                      onChange={(e) => setCardQuantity(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-800 dark:text-blue-300">
                      Tổng tiền thanh toán:
                    </span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {cardValue && cardQuantity
                        ? (
                            parseInt(cardValue) * parseInt(cardQuantity)
                          ).toLocaleString()
                        : 0}
                      đ
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Đổi thẻ ngay <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
