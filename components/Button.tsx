import LoadingDots from './LoadingDots';

interface ButtonProps {
  loading?: boolean;
  label: string;
  onClick?: (e: any) => void;
}

const Button = ({ label, loading, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <LoadingDots color="white" style="large" /> : label}
    </button>
  );
};

export default Button;
