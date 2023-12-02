import { CaseType } from "./Game";

type CaseTypeProps = CaseType & {
    onClick: () => void;
}

export function Case({ onClick, canBePlayed }: CaseTypeProps): JSX.Element {
    return (
        <div
            onClick={canBePlayed ? onClick : () => { }}
            className={`w-16 h-16 m-1 opacity-25 rounded-lg ${canBePlayed ? 'border-4 border-white cursor-pointer' : ''}`}
        ></div>
    );
}
