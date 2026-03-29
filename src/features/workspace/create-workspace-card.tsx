import { Label, Button } from "@/shared/components";

export default function CreateWorkspaceCard() {
    return (
        <>
            <div className="relative space-y-4">
                <Label
                    className="text-sm"
                    required={true}
                >
                    Обязательные поля отмечены
                </Label>


                <div className="flex-1 space-y-3">
                    <Label
                        className="text-sm"
                        required={true}
                    >
                        Название
                    </Label>
                    <input
                        value={""}
                        placeholder=""
                        className="flex w-full bg-transparent outline-none text-sm border
                        border-gray-700 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500"
                    />
                </div>

                <div className="flex-1 space-y-3">
                    <Label
                        className="text-sm"
                    >
                        Описание (опционально)
                    </Label>
                    <textarea
                        value={""}
                        placeholder=""
                        className="flex w-full bg-transparent outline-none text-sm border
                        border-gray-700 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-end items-center mt-5">
                <Button size={"xl"} variant={"custom"}>
                    Сохранить
                </Button>
            </div>
        </>
    );
}