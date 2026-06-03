// Main Application Logic for Techcombank Q&A Chatbot Prototype

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatTrigger = document.querySelector(".chatbot-trigger");
    const chatView = document.querySelector(".chat-view");
    const closeChat = document.querySelector(".close-chat");
    const chatMessages = document.querySelector(".chat-messages");
    const chatInput = document.querySelector(".chat-input");
    const sendBtn = document.querySelector(".send-btn");
    const suggestionsList = document.querySelector(".suggestions-list");
    
    let faqDatabase = [];
    let isAgentConnected = false;

    // Load FAQs from faqs.json
    fetch("faqs.json")
        .then(response => response.json())
        .then(data => {
            faqDatabase = data;
            console.log("FAQ Database loaded:", faqDatabase.length, "items.");
            // Populate stats in external panel if they exist
            const faqCountEl = document.getElementById("faq-count");
            if (faqCountEl) {
                faqCountEl.textContent = faqDatabase.length;
            }
        })
        .catch(err => {
            console.error("Error loading FAQs:", err);
            // Fallback mock database if fetch fails
            faqDatabase = [
                {
                    "question": "Tại sao tôi phải cập nhật thông tin sinh trắc học trên Techcombank Mobile?",
                    "answer": "Để tuân thủ Quyết định 2345/QĐ-NHNN của Ngân hàng Nhà nước, việc xác thực sinh trắc học (khuôn mặt khớp với CCCD gắn chip) là bắt buộc đối với các giao dịch chuyển tiền trực tuyến trên 10 triệu đồng/giao dịch hoặc tổng cộng dồn trên 20 triệu đồng/ngày, nhằm phòng chống gian lận và bảo vệ tài khoản khách hàng.",
                    "category": "Sinh trắc học"
                },
                {
                    "question": "Các bước tự cập nhật sinh trắc học trên Techcombank Mobile như thế nào?",
                    "answer": "Bước 1: Đăng nhập Techcombank Mobile, chọn Menu (góc trái trên) > Cài đặt > Thông tin cá nhân > Cập nhật thông tin sinh trắc học. Bước 2: Chụp ảnh khuôn mặt. Bước 3: Đặt thẻ CCCD gắn chip vào mặt sau điện thoại để quét NFC. Bước 4: Xác thực và lưu kết quả.",
                    "category": "Sinh trắc học"
                },
                {
                    "question": "Hạn mức chuyển tiền mặc định trên Techcombank Mobile là bao nhiêu và có mất phí không?",
                    "answer": "Hạn mức chuyển tiền mặc định là 5 tỷ đồng/ngày. Techcombank áp dụng chính sách miễn phí 100% cho mọi giao dịch chuyển khoản nhanh 24/7 và chuyển khoản thường trong nước được thực hiện qua ứng dụng Techcombank Mobile.",
                    "category": "Hạn mức & Biểu phí"
                },
                {
                    "question": "Tôi muốn gửi tiết kiệm online trên app Techcombank thì lãi suất tính như thế nào?",
                    "answer": "Lãi suất gửi tiết kiệm online trên Techcombank Mobile được cập nhật theo từng thời kỳ và thường được cộng thêm biên độ khuyến khích từ 0.1% đến 0.3%/năm so với biểu lãi suất niêm yết tại quầy giao dịch.",
                    "category": "Lãi suất tiết kiệm"
                },
                {
                    "question": "Làm thế nào để khóa thẻ khẩn cấp khi bị mất thẻ Techcombank?",
                    "answer": "Bạn đăng nhập ứng dụng Techcombank Mobile, vào mục 'Quản lý thẻ' > chọn thẻ cần khóa > nhấn nút 'Khóa thẻ khẩn cấp'. Thẻ sẽ lập tức bị khóa tạm thời để bảo vệ tiền của bạn. Bạn cũng có thể gọi hotline 24/7: 1800 588 822 để tổng đài viên khóa thẻ.",
                    "category": "Dịch vụ thẻ"
                }
            ];
        });

    // Toggle Chat View
    chatTrigger.addEventListener("click", () => {
        chatView.classList.add("active");
        chatTrigger.style.transform = "scale(0)";
        
        // Send initial greeting if chat is empty
        if (chatMessages.children.length <= 0) {
            setTimeout(() => {
                addBotMessage("Xin chào quý khách! Tôi là **Trợ lý Ảo Techcombank**, sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn về Lãi suất, Biểu phí, Sinh trắc học và Dịch vụ thẻ. Bạn cần tra cứu thông tin gì hôm nay?");
            }, 500);
        }
    });

    closeChat.addEventListener("click", () => {
        chatView.classList.remove("active");
        chatTrigger.style.transform = "scale(1)";
    });

    // Sidebar & Help/Support Toggle Triggers
    const menuBtn = document.querySelector(".menu-btn-circle");
    const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
    const sidebarView = document.querySelector(".sidebar-view");
    const closeSidebar = document.querySelector(".close-sidebar");
    const helpSupportLink = document.querySelector(".help-support-link-btn");
    const helpSupportView = document.querySelector(".help-support-view");
    const backBtnHelp = document.querySelector(".back-btn-help");

    // Open Sidebar
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            sidebarView.classList.add("active");
            sidebarBackdrop.classList.add("active");
        });
    }

    // Close Sidebar
    const hideSidebar = () => {
        sidebarView.classList.remove("active");
        sidebarBackdrop.classList.remove("active");
    };

    if (closeSidebar) closeSidebar.addEventListener("click", hideSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", hideSidebar);

    // Open Help & Support
    if (helpSupportLink) {
        helpSupportLink.addEventListener("click", (e) => {
            e.preventDefault();
            helpSupportView.classList.add("active");
        });
    }

    // Close Help & Support (Back to Sidebar)
    if (backBtnHelp) {
        backBtnHelp.addEventListener("click", () => {
            helpSupportView.classList.remove("active");
        });
    }


    // Suggested Chips Clicks
    suggestionsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("suggestion-chip")) {
            const queryText = e.target.textContent;
            addUserMessage(queryText);
            processQuery(queryText);
        }
    });

    // Send Message Actions
    sendBtn.addEventListener("click", () => {
        sendMessage();
    });

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const queryText = chatInput.value.trim();
        if (!queryText) return;
        
        addUserMessage(queryText);
        chatInput.value = "";
        
        processQuery(queryText);
    }

    // Add User Message to bubble list
    function addUserMessage(text) {
        const timeStr = getCurrentTime();
        const msgHtml = `
            <div class="message user">
                <div class="msg-bubble">${escapeHtml(text)}</div>
                <div class="msg-time">${timeStr}</div>
            </div>
        `;
        chatMessages.insertAdjacentHTML("beforeend", msgHtml);
        scrollToBottom();
    }

    // Add Bot Message with typing animation
    function addBotMessage(text, isEmergency = false, customHtml = "") {
        const timeStr = getCurrentTime();
        const botMsgId = "bot-msg-" + Date.now();
        
        const msgHtml = `
            <div class="message bot" id="${botMsgId}">
                <div class="msg-bubble ${isEmergency ? 'emergency-alert' : ''}">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
                <div class="msg-time">${timeStr}</div>
            </div>
        `;
        chatMessages.insertAdjacentHTML("beforeend", msgHtml);
        scrollToBottom();

        // Simulate thinking and then type out the answer
        setTimeout(() => {
            const botMessageEl = document.getElementById(botMsgId);
            const bubbleEl = botMessageEl.querySelector(".msg-bubble");
            
            // Format bold markdown-like notation to HTML strong tags
            const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            bubbleEl.innerHTML = ""; // Clear indicator
            
            if (isEmergency) {
                bubbleEl.innerHTML = formattedText;
            } else {
                // Typewriter effect
                let i = 0;
                bubbleEl.innerHTML = "";
                
                // For HTML tags, type them as blocks rather than char-by-char
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = formattedText;
                
                // Fast simulate text writing
                bubbleEl.innerHTML = formattedText; 
                
                if (customHtml) {
                    bubbleEl.insertAdjacentHTML("beforeend", customHtml);
                }
            }
            scrollToBottom();
        }, 800 + Math.random() * 500);
    }

    // Core AI Response matching logic (Knowledge-Retrieval simulation)
    function processQuery(query) {
        // Normalizing search input
        const cleanQuery = removeVietnameseTones(query.toLowerCase());
        
        // 1. Check for Emergency Security Keywords
        const emergencyKeywords = ["hack", "bi lua", "lua dao", "mat tien", "mat acc", "lo otp", "lo mat khau"];
        const hasEmergency = emergencyKeywords.some(keyword => cleanQuery.includes(keyword));
        
        if (hasEmergency) {
            const emergencyText = `
                <div class="emergency-title">⚠️ CẢNH BÁO BẢO MẬT KHẨN CẤP</div>
                <div class="emergency-desc">Hệ thống phát hiện tài khoản của bạn đang có dấu hiệu bị đe dọa bảo mật hoặc lừa đảo mất tiền. 
                Vui lòng <strong>KHÔNG</strong> chia sẻ OTP, mật khẩu cho bất kỳ ai. Để bảo vệ tài sản, bạn nên liên hệ khẩn cấp tổng đài hỗ trợ 24/7 để khóa tạm thời tài khoản/thẻ ngay lập tức.</div>
                <a href="tel:1800588822" class="emergency-btn">Gọi Ngay Tổng Đài: 1800 588 822 (Miễn Phí)</a>
            `;
            addBotMessage(emergencyText, true);
            return;
        }

        // 2. If Agent is connected, bypass bot
        if (isAgentConnected) {
            simulateAgentResponse();
            return;
        }

        // 3. Simple Keyword Match from crawled faqs.json database
        let bestMatch = null;
        let highestScore = 0;

        faqDatabase.forEach(faq => {
            const qClean = removeVietnameseTones(faq.question.toLowerCase());
            const aClean = removeVietnameseTones(faq.answer.toLowerCase());
            
            // Calculate simple match score based on keyword overlap
            const words = cleanQuery.split(/\s+/);
            let matchCount = 0;
            words.forEach(word => {
                if (word.length > 2 && (qClean.includes(word) || aClean.includes(word))) {
                    matchCount++;
                }
            });

            if (matchCount > highestScore) {
                highestScore = matchCount;
                bestMatch = faq;
            }
        });

        // 4. Decision Threshold (Low-confidence path vs Happy path)
        if (bestMatch && highestScore >= 2) {
            // Happy path
            const sourceInfo = bestMatch.source ? `<div style="font-size: 11px; color: #888; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px;">Nguồn: <a href="${bestMatch.source}" target="_blank" style="color: #da251d; text-decoration: none;">Techcombank Portal</a></div>` : "";
            addBotMessage(bestMatch.answer, false, sourceInfo);
        } else {
            // Low confidence path (Fallback options)
            const fallbackText = "Tôi chưa tìm thấy câu trả lời chính xác cho câu hỏi này trong cơ sở tri thức hiện hành của Techcombank. Quý khách có muốn kết nối với **Nhân viên hỗ trợ khách hàng trực tuyến 24/7** để được giải đáp trực tiếp không?";
            const customButtons = `
                <div>
                    <button class="transfer-btn" onclick="window.connectToAgent()">Kết nối hỗ trợ viên</button>
                </div>
            `;
            addBotMessage(fallbackText, false, customButtons);
        }
    }

    // Mock human support agent takes over chat flow
    window.connectToAgent = function() {
        // Toggle state
        isAgentConnected = true;
        
        // Update Bot header metadata dynamically to show human status
        const botName = document.querySelector(".bot-info h3");
        const botStatus = document.querySelector(".bot-info p");
        const botAvatar = document.querySelector(".bot-avatar");
        
        botName.textContent = "Hỗ Trợ Viên: Thu Trang";
        botStatus.textContent = "Đang trực tuyến";
        botStatus.style.color = "#4cd137";
        botAvatar.style.background = "linear-gradient(135deg, #10ac84, #1dd1a1)";
        botAvatar.innerHTML = "💬<div class='active-dot'></div>";

        // Display transition message in chat log
        const transferAlert = `
            <div style="text-align: center; font-size: 11px; color: var(--text-secondary); margin: 10px 0; border-top: 1px dashed rgba(255,255,255,0.1); border-bottom: 1px dashed rgba(255,255,255,0.1); padding: 6px 0;">
                Hệ thống đã chuyển kết nối đến Điện thoại viên Nguyễn Thu Trang.
            </div>
        `;
        chatMessages.insertAdjacentHTML("beforeend", transferAlert);
        scrollToBottom();

        // Agent initial message
        setTimeout(() => {
            addBotMessage("Xin chào quý khách! Tôi là Nguyễn Thu Trang, hỗ trợ viên trực tuyến của Techcombank. Tôi đã đọc lịch sử trò chuyện của bạn. Tôi có thể hỗ trợ gì thêm cho bạn về thắc mắc tra cứu này?");
        }, 1200);
    };

    function simulateAgentResponse() {
        const agentAnswers = [
            "Techcombank hiện tại đang áp dụng chính sách ưu đãi không mất phí quản lý tài khoản và phí giao dịch trực tuyến trên ứng dụng Techcombank Mobile ạ. Quý khách có thắc mắc thêm về biểu phí thẻ tín dụng không?",
            "Dạ, đối với thắc mắc này của quý khách, ngoài việc xem online, quý khách cũng có thể liên hệ số hotline 1800-588822 bất cứ lúc nào, các bạn tổng đài viên chuyên trách sẽ tra cứu chi tiết số dư và biểu phí giao dịch cụ thể của riêng tài khoản quý khách nhé ạ.",
            "Tôi có thể hỗ trợ kiểm tra thêm thông tin dịch vụ này giúp quý khách. Quý khách có thể cho tôi xin tên đầy đủ để tiện xưng hô không ạ?"
        ];
        
        const randomAnswer = agentAnswers[Math.floor(Math.random() * agentAnswers.length)];
        setTimeout(() => {
            addBotMessage(randomAnswer);
        }, 1000);
    }

    // Helper: Scroll Chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper: Current Time string
    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Helper: Escape HTML strings
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Helper: Normalize Vietnamese strings for matching
    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Remove extra spaces
        str = str.replace(/ + /g," ");
        str = str.trim();
        return str;
    }
});
