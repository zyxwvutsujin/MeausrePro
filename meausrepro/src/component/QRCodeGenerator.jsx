import { useState } from "react";
import axios, {AxiosHeaders as Buffer} from "axios";

function QRCodeGenerator() {
    const [inputValue, setInputValue] = useState("");
    const [qrCodeImage, setQrCodeImage] = useState(null);

    const generateQRCode = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/MeausrePro/Maps/generateQRCode`, {
                params: { data: inputValue },
                responseType: "arraybuffer"
            });
            const base64Image = Buffer.from(response.data, "binary").toString("base64");
            setQrCodeImage(`data:image/png;base64,${base64Image}`);
        } catch (error) {
            console.error("QR 코드 생성 오류:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="QR 코드에 넣을 데이터 입력"
            />
            <button onClick={generateQRCode}>QR 코드 생성</button>
            {qrCodeImage && <img src={qrCodeImage} alt="Generated QR Code" />}
        </div>
    );
}

export default QRCodeGenerator;
