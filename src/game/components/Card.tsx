import { CaseType } from "./Game";

export type CardType = CaseType & {
    onClick: () => void;
}

export function Card({ color, number, onClick }: CardType): JSX.Element {
    return (
        <div onClick={onClick} className={`flex justify-center items-center bg-black text-white text-2xl font-black w-16 h-16 m-1 border-${color}-500 border-4 rounded-lg cursor-pointer`}>
            <p>{number}</p>
        </div>
    );
}