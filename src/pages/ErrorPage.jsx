import { Link } from "react-router-dom";

const ErrorPage = () => {
    console.log('ErrorPage is rendering!');

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-8">Trang không tồn tại!</p>
                <Link 
                    to="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}

export default ErrorPage;