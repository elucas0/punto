import { CaseType } from "./Game";

type CaseTypeProps = CaseType & {
    onClick: () => void;
}

export function Case({ onClick, color, canBePlayed }: CaseTypeProps): JSX.Element {
    return (
        <div
            onClick={canBePlayed ? onClick : () => { }}
            className={`w-16 h-16 m-1 bg-${color}-200 rounded-lg ${canBePlayed ? 'border-4 border-slate-500 cursor-pointer' : ''}`}
        ></div>
    );
}
