import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const registerEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/meausrepro/user/register`, {
                id: id,
                pass: pass,
                name: name,
                tel: tel,
                role: ''  // 권한 설정은 비워둡니다.
            });

            if (response.data) {
                // 회원가입 성공 후, 로그인 페이지로 이동
                navigate('/login');
            }
        } catch (err) {
            setError(err.response.data.message || '회원가입 실패');
        }
    };

    return (
        <div className={'container d-grid gap-2'}>
            <form onSubmit={registerEvent} className={'d-grid gap-2'}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                />
                <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? "숨기기" : "보기"}
                </button>
                <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="전화번호"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    required
                />
                <button type={'submit'} className={'btn btn-primary'}>회원가입</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );


}

export default Register;
