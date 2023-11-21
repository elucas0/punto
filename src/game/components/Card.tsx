import { CaseType } from "../index";

type CardProps = CaseType & {
    onClick: () => void;
}

export function Card({ color, number, onClick }: CardProps): JSX.Element {
    return (
        <div onClick={onClick} className={`flex justify-center items-center bg-slate-800 text-white text-2xl font-black w-16 h-16 m-1 border-${color}-500 border-4 rounded-lg cursor-pointer`}>
            <p>{number}</p>
        </div>
    );
}