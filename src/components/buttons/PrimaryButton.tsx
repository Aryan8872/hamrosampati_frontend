import { Link } from "react-router-dom";

interface PrimaryButtonProps {
    to: string;
    text: string;
    onClick?: () => void;
    className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ to, text, onClick, className = "" }) => {
    return (
        <Link 
            to={to} 
            className={`bg-buttonColor text-white px-4 py-2 rounded-md hover:bg-green-600 ${className}`} 
            onClick={onClick}
        >
            {text}
        </Link>
    );
};

export default PrimaryButton;
