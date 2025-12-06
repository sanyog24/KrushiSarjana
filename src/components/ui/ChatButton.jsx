import { useState, useEffect } from 'react';
import { Button, Modal, Box, Avatar, TextField, IconButton, Typography, CircularProgress } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import { getFarmerDetails } from "../../api/farmer.js";
import { AuthAPI } from "../../api/api.js";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";



const socket = io("http://localhost:5002"); // Connect to the backend

const style = {
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '70vh'
};

const ChatButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndFarmer = async () => {
      try {
        if (showChat && !user) {
          setLoading(true);

          // Fetch user data from token
          const token = localStorage.getItem("token");
          if (!token) return;

          const decoded = jwtDecode(token);
          if (!decoded.id) return console.error("User ID not found in token");

          const userData = await AuthAPI.getUserById(decoded.id);
          setUser(userData);

          // Fetch farmer data using the user ID
          const farmerData = await getFarmerDetails(decoded.id);
          setFarmer(farmerData);
        }
      } catch (error) {
        console.error("Error fetching user or farmer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFarmer();
  }, [showChat]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message); // Debug log
      setMessages((prev) => {
        console.log("Previous messages:", prev); // Debug log
        return [...prev, message];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const handleSendMessage = () => {
    if (!farmer) {
      console.error("Farmer data not loaded yet");
      return;
    }

    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toISOString(),
        farmerId: farmer.id,
        farmerName: farmer.name
      };

      console.log("Sending message:", message); // Debug log
      socket.emit("send_message", message);

      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <div>
         <Button
      variant="contained"
      onClick={() => setShowChat(true)}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        borderRadius: "50px", // Rounded corners
        padding: "12px 24px", // Adequate padding
        fontSize: "16px", // Larger font size
        fontWeight: "600", // Bold text
        textTransform: "none", // Prevent uppercase transformation
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        transition: "all 0.3s ease", // Smooth transitions
        backgroundColor: "#4CAF50", // Green background color
        color: "#fff", // White text color
        "&:hover": {
          transform: "translateY(-2px)", // Lift button on hover
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
          backgroundColor: "#45a049", // Slightly darker green on hover
        },
        "&:active": {
          transform: "translateY(0)", // Reset lift on click
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Reset shadow on click
        },
        display: "flex",
        alignItems: "center",
        gap: "8px", // Space between icon and text
      }}
      startIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: "#fff" }} // Ensure the icon is white
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      } // Custom SVG icon for chat
    >
      Chat Now
    </Button>

      <Modal open={showChat} onClose={() => setShowChat(false)}>
        <Box sx={style}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{
                p: 2,
                borderBottom: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f5f5f5'
              }}>
                <Avatar sx={{ bgcolor: 'green' }}>🌾</Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1">
                    {farmer?.name || "Farmer"}
                  </Typography>
                  <Typography variant="caption">
                    {farmer?.location || "Agricultural Community"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((message) => {
                  console.log("Rendering message:", message); // Debug log
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexDirection: message.farmerId === farmer?.id ? 'row-reverse' : 'row'
                      }}
                    >
                      <Avatar sx={{
                        bgcolor: message.farmerId === farmer?.id ? 'primary.main' : 'grey.300',
                        width: 32,
                        height: 32
                      }}>
                        {message.farmerId === farmer?.id ? '👨🌾' : '👩🌾'}
                      </Avatar>
                      <Box sx={{
                        mx: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.farmerId === farmer?.id ? 'primary.light' : 'grey.100'
                      }}>
                        <Typography variant="body2">{message.text}</Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
                {showEmojis && (
                  <EmojiPicker
                    onEmojiClick={(emoji) => setNewMessage((prev) => prev + emoji.emoji)}
                    height={300}
                  />
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => setShowEmojis(!showEmojis)}>
                    😀
                  </IconButton>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask about crops, weather, or equipment..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!farmer}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !farmer}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ChatButton;