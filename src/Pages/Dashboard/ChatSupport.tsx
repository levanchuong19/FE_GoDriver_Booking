import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Input, List, Row, Space, Spin, Typography } from "antd";
import dayjs from "dayjs";
import {
  getChatMessages,
  getChatUnreadCount,
  listChatBookings,
  markChatRead,
  sendChatMessage,
} from "../../Config/managementApi";
import { getErrorMessage } from "../../Utils/apiData";
import { notifyError } from "../../Utils/notify";

type ChatBooking = Record<string, unknown> & {
  bookingId?: string;
  _id?: string;
  id?: string;
};
type ChatMessage = Record<string, unknown> & {
  _id?: string;
  message?: string;
  content?: string;
  createdAt?: string;
};

function bookingIdOf(row: ChatBooking) {
  return String(row.bookingId || row._id || row.id || "");
}

export default function ChatSupportPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<ChatBooking[]>([]);
  const [unread, setUnread] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const [list, count] = await Promise.all([
        listChatBookings(),
        getChatUnreadCount(),
      ]);
      setBookings(list.items as ChatBooking[]);
      setUnread(count);
    } catch (error) {
      notifyError(error, "Không tải được danh sách chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openChat = async (id: string) => {
    setSelectedId(id);
    setMsgLoading(true);
    try {
      const data = await getChatMessages(id);
      setMessages(data.items as ChatMessage[]);
      await markChatRead(id).catch(() => undefined);
      await loadBookings();
    } catch (error) {
      notifyError(error, "Không tải được tin nhắn");
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedId || !text.trim()) return;
    setSending(true);
    try {
      await sendChatMessage(selectedId, text.trim());
      setText("");
      await openChat(selectedId);
    } catch (error) {
      notifyError(error, "Gửi tin nhắn thất bại");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <Card
        title={
          <Space>
            <span>Chat hỗ trợ (booking)</span>
            <Badge count={unread} />
          </Space>
        }
        extra={<Button onClick={loadBookings}>Làm mới</Button>}
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Spin spinning={loading}>
              <List
                bordered
                dataSource={bookings}
                locale={{ emptyText: "Không có booking chat" }}
                renderItem={(item) => {
                  const id = bookingIdOf(item);
                  return (
                    <List.Item
                      className={`cursor-pointer ${
                        selectedId === id ? "bg-green-50" : ""
                      }`}
                      onClick={() => openChat(id)}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <span>{id.slice(0, 10)}…</span>
                            <Badge
                              count={Number(item.unreadCount || 0)}
                              size="small"
                            />
                          </Space>
                        }
                        description={
                          String(
                            item.lastMessage ||
                              (item.lastMessageObj as { message?: string } | undefined)
                                ?.message ||
                              item.status ||
                              "—"
                          )
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Spin>
          </Col>
          <Col xs={24} md={16}>
            <Card type="inner" title={selectedId || "Chọn booking để xem chat"}>
              <Spin spinning={msgLoading}>
                <div className="h-[420px] overflow-y-auto space-y-3 mb-3">
                  {messages.map((msg, index) => (
                    <div
                      key={String(msg._id || index)}
                      className="rounded border p-2 bg-gray-50"
                    >
                      <Typography.Text>
                        {String(msg.message || msg.content || "")}
                      </Typography.Text>
                      <div className="text-xs text-gray-400 mt-1">
                        {msg.createdAt
                          ? dayjs(msg.createdAt).format("DD/MM HH:mm")
                          : ""}
                      </div>
                    </div>
                  ))}
                  {!messages.length && (
                    <div className="text-gray-400">Chưa có tin nhắn</div>
                  )}
                </div>
              </Spin>
              <Space.Compact className="w-full">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  disabled={!selectedId}
                  onPressEnter={handleSend}
                />
                <Button
                  type="primary"
                  disabled={!selectedId}
                  loading={sending}
                  onClick={handleSend}
                >
                  Gửi
                </Button>
              </Space.Compact>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
