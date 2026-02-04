import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/images/logo-cong-an.png";

const LOGIN_TITLE = "ĐĂNG NHẬP HỆ THỐNG HỎI ĐÁP PHÁP LUẬT – NỘI BỘ CAND";
const INTERNAL_WARNING = "Chỉ dành cho tài khoản nội bộ. Mọi truy cập được ghi nhận theo quy định.";
const SUPPORT_EMAIL = "hotro@cand.gov.vn";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // 1. Thêm state cho Email
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // 2. Kiểm tra cả 3 trường phải có dữ liệu
        if (username && email && password) {
            if (onLogin) {
                // Truyền username (và email nếu cần) ra ngoài
                onLogin(username, email);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <div className="logo-wrapper">
                    <img src={logo} alt="Logo CAND" className="logo-image" />
                </div>
                <h2 className="login-title">{LOGIN_TITLE}</h2>
                <p className="login-subtitle">Hệ thống Quản lý Tri thức Pháp luật</p>
            </div>

            <div className="login-body">
                <div className="login-card">
                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Field 1: Tên đăng nhập */}
                        <div className="form-group-auth">
                            <label htmlFor="username" className="form-label">
                                Tên đăng nhập / Số hiệu
                            </label>
                            <input id="username" name="username" type="text" required placeholder="Nhập số hiệu CAND..." value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" />
                        </div>

                        {/* Field 2: Email (Mới thêm) */}
                        <div className="form-group-auth">
                            <label htmlFor="email" className="form-label">
                                Email nội bộ / Liên hệ
                            </label>
                            <input id="email" name="email" type="email" required placeholder="example@cand.gov.vn" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                        </div>

                        {/* Field 3: Mật khẩu */}
                        <div className="form-group-auth">
                            <label htmlFor="password" className="form-label">
                                Mật khẩu
                            </label>
                            <input id="password" name="password" type="password" required placeholder="Nhập mật khẩu..." value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
                        </div>

                        <div className="form-actions">
                            <div className="contact-support">
                                <span className="text-gray">Chưa có tài khoản? Liên hệ hỗ trợ: </span>
                                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-bold support-link">
                                    {SUPPORT_EMAIL}
                                </a>
                            </div>
                        </div>

                        <div className="submit-wrapper">
                            <button type="submit" className="btn-submit">
                                ĐĂNG NHẬP
                            </button>
                            <a href="#" className="forgot-password">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </form>

                    <div className="login-footer">
                        <div className="divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">LƯU Ý</span>
                        </div>
                        <div className="warning-box">
                            <p className="warning-text">{INTERNAL_WARNING}</p>
                            <p className="security-note">Không chia sẻ thông tin đăng nhập/OTP.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
