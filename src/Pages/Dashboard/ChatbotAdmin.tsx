import { useEffect, useState } from "react";
import { Button, Card, Input, Space, Typography, message } from "antd";
import {
  clearChatbotHistory,
  getChatbotHistory,
  sendChatbotMessage,
} from "../../Config/managementApi";
import { notifyError } from "../../Utils/notify";

type HistoryItem = { role?: string; content?: string };

export default function ChatbotAdminPage() {
  const [sessionId, setSessionId] = useState("admin-dashboard");
  const [text, setText] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async (id = sessionId) => {
    if (!id.trim()) return;
    try {
      const data = (await getChatbotHistory(id.trim())) as {
        history?: HistoryItem[];
      };
      setHistory(Array.isArray(data?.history) ? data.history : []);
    } catch (error) {
      notifyError(error, "Không tải được lịch sử chatbot");
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!text.trim() || !sessionId.trim()) return;
    setLoading(true);
    try {
      const data = (await sendChatbotMessage(
        text.trim(),
        sessionId.trim(),
      )) as { response?: string };
      setText("");
      if (data?.response) {
        setHistory((prev) => [
          ...prev,
          { role: "user", content: text.trim() },
          { role: "assistant", content: data.response },
        ]);
      } else {
        await loadHistory();
      }
    } catch (error) {
      notifyError(error, "Gửi chatbot thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!sessionId.trim()) return;
    setLoading(true);
    try {
      await clearChatbotHistory(sessionId.trim());
      setHistory([]);
      message.success("Đã xóa lịch sử session");
    } catch (error) {
      notifyError(error, "Xóa lịch sử thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Card
        title="Chatbot SmartDrive"
        extra={
          <Space>
            <Button onClick={() => loadHistory()} loading={loading}>
              Tải lịch sử
            </Button>
            <Button danger onClick={handleClear} loading={loading}>
              Xóa lịch sử
            </Button>
          </Space>
        }
      >
        <Space className="mb-4 w-full" direction="vertical">
          <Input
            addonBefore="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
        </Space>

        <div className="h-[460px] overflow-y-auto border rounded p-3 mb-3 space-y-2 bg-gray-50">
          {history.map((item, index) => (
            <div
              key={index}
              className={`rounded p-2 ${
                item.role === "assistant"
                  ? "bg-white border"
                  : "bg-green-50 border border-green-100"
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">
                {item.role || "unknown"}
              </div>
              <Typography.Text>{item.content || ""}</Typography.Text>
            </div>
          ))}
          {!history.length && (
            <div className="text-gray-400">Chưa có hội thoại</div>
          )}
        </div>

        <Space.Compact className="w-full">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hỏi chatbot về SmartDrive..."
            onPressEnter={handleSend}
          />
          <Button type="primary" loading={loading} onClick={handleSend}>
            Gửi
          </Button>
        </Space.Compact>
      </Card>
    </div>
  );
}
