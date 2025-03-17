import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { PencilLine, Trash, Star } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function RequestPage() {
    const [tableData, setTableData] = useState([]);
    const { apikey } = useAuth();
    const [mess, setMess] = useState("Đang tải dữ liệu...");
    const fetchData = async () => {
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQjxP1gA-rH9LzKp-uSfCwi0TVrvzTH7mg1MuD73QGAxIVD66G-OsNna5uh_P2qfEC/exec";
        
        try {
            const response = await fetch(`${WEB_APP_URL}?api_key=${apikey}`);
            const data = await response.json();

            if (!Array.isArray(data)) {
                
                setMess("Không có dữ liệu...")
                return;
            }

            setTableData(data.map(item => ({ ...item, rated: false }))); // Thêm trạng thái "rated" ban đầu là false
        } catch (error) {
           
            setMess("Không có dữ liệu...")
        }
    };

    useEffect(() => {
        if (apikey) {
            fetchData();
        }
    }, [apikey]);

    // Hàm xuất PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Danh sách câu hỏi", 14, 10);
        
        autoTable(doc, {
            startY: 20,
            head: [["#", "Question", "Answer", "Creation Date"]],
            body: tableData.map((item, index) => [
                index + 1,
                item.question, // Không cắt dữ liệu
                item.answer,
                new Date(item.date).toLocaleDateString()
            ]),
            styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
            columnStyles: {
                1: { cellWidth: 80 }, // Cột câu hỏi rộng hơn
                2: { cellWidth: 50 }, // Cột đáp án nhỏ hơn
            }
        });

        doc.save("Danh_sach_cau_hoi.pdf");
    };

    // Hàm thay đổi trạng thái đánh giá
    const handleRating = (index) => {
        const updatedData = [...tableData];
        updatedData[index].rated = !updatedData[index].rated; // Đổi trạng thái đánh giá
        setTableData(updatedData);
    };

    return (
        <div className="card">
            <div className="card-header flex justify-between">
                <p className="card-title">Danh sách câu hỏi</p>
                <button
                    onClick={exportToPDF}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Export PDF
                </button>
            </div>
            <div className="card-body p-0">
                <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                    <table className="table">
                        <thead className="table-header">
                            <tr className="table-row">
                                <th className="table-head">#</th>
                                <th className="table-head">Câu hỏi</th>
                                <th className="table-head">Đáp án</th>
                                <th className="table-head">Ngày tạo</th>
                                <th className="table-head">Đánh giá</th> {/* Cột Đánh giá */}
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {tableData.length > 0 ? (
                                tableData.map((item, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="table-cell">{index + 1}</td>
                                        <td className="table-cell">
                                            {item.question.length > 50
                                                ? `${item.question.slice(0, 50)}...`
                                                : item.question}
                                        </td>
                                        <td className="table-cell">{item.answer.length > 20
                                                ? `${item.answer.slice(0, 20)}...`
                                                : item.answer}</td>
                                        <td className="table-cell">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="table-cell">
                                            <div
                                                className="flex items-center justify-center gap-x-2 cursor-pointer"
                                                onClick={() => handleRating(index)}
                                            >
                                                <Star
                                                    size={20}
                                                    className={item.rated ? "fill-yellow-500" : "fill-white-200"} // Đổi màu khi được đánh giá
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">
                                        {mess}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RequestPage;
