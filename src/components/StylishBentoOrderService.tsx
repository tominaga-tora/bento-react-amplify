import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import Spinner from "./Spinner";

const saveOrderToDB = async (employeeId: string, bentoType: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Order saved: Employee ${employeeId} ordered ${bentoType}`);
  return true;
};

const bentoTypes = [
  { id: "A", name: "Bento A", image: "/src/assets/bento/001.jpg" },
  { id: "B", name: "Bento B", image: "/src/assets/bento/002.jpg" },
  { id: "C", name: "Bento C", image: "/src/assets/bento/003.jpg" },
  { id: "D", name: "Bento D", image: "/src/assets/bento/004.jpg" },
];

export default function StylishBentoOrderService() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedBento, setSelectedBento] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<
    Array<{ date: string; employeeId: string; bentoType: string }>
  >([]);
  const [isOrdering, setIsOrdering] = useState(false); // 注文処理中のフラグを追加

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeId(e.target.value);
    setErrorMessage(null);
  };

  const handleBentoSelection = (bentoId: string) => {
    if (!employeeId) {
      setErrorMessage("社員番号を入力してください。");
      return;
    }
    setSelectedBento(bentoId);
    setIsConfirmOpen(true);
  };

  const handleOrder = async () => {
    if (selectedBento && employeeId && !isOrdering) {
      setIsOrdering(true); // 注文処理開始
      const success = await saveOrderToDB(employeeId, selectedBento);
      if (success) {
        setIsConfirmOpen(false);
        setIsOrderComplete(true);
        setToastMessage("弁当の注文が完了しました。");
        // 注文をorders配列に追加
        setOrders((prevOrders) => [
          ...prevOrders,
          {
            date: new Date().toISOString(),
            employeeId: employeeId,
            bentoType: selectedBento,
          },
        ]);
        setEmployeeId("");
        setSelectedBento(null);
      }
      setIsOrdering(false); // 注文処理終了
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const csvData = [
    ["Date", "EmployeeID", "BentoType"],
    ...orders.map((order) => [order.date, order.employeeId, order.bentoType]),
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100 relative">
      {isOrdering && <Spinner />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          スタイリッシュ弁当注文サービス
        </h1>

        <div className="mb-8">
          <label
            htmlFor="employeeId"
            className="block text-sm font-medium text-teal-300 mb-2"
          >
            社員番号
          </label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={handleEmployeeIdChange}
            placeholder="社員番号を入力してください"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-100 placeholder-gray-400"
          />
          {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {bentoTypes.map((bento) => (
            <div
              key={bento.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <img
                src={bento.image}
                alt={bento.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-3 text-lg text-teal-300">
                  {bento.name}
                </h3>
                <button
                  onClick={() => handleBentoSelection(bento.id)}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  注文する
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <CSVLink
            data={csvData}
            filename={"bento_orders.csv"}
            className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 inline-block"
          >
            CSV出力
          </CSVLink>
        </div>

        {isConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                注文の確認
              </h2>
              <p className="mb-6 text-gray-300">
                {selectedBento &&
                  `${
                    bentoTypes.find((b) => b.id === selectedBento)?.name
                  }を注文しますか？`}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isOrdering}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleOrder}
                  disabled={isOrdering}
                  className={`px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-300 ${
                    isOrdering
                      ? "cursor-not-allowed opacity-50"
                      : "hover:from-teal-600 hover:to-blue-600"
                  }`}
                >
                  注文する
                </button>
              </div>
            </div>
          </div>
        )}

        {isOrderComplete && (
          <div
            className="mt-8 bg-teal-900 border-l-4 border-teal-500 text-teal-100 p-4 rounded-r-md"
            role="alert"
          >
            <p className="font-bold">注文完了</p>
            <p>弁当の注文が完了しました。</p>
          </div>
        )}

        {toastMessage && (
          <div
            className="fixed bottom-4 right-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-md shadow-lg"
            role="alert"
          >
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
